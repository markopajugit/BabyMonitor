# ============================================
# SYNC_SERVICE.PY - Main orchestrator
# ============================================

import asyncio
import logging
import os
from datetime import datetime, timezone, timedelta

from services.config.config_loader import ConfigLoader
from .api_client import OwletAPIClient
from .data_processor import VitalDataProcessor
from .file_manager import OwletFileManager
from .event_creator import EventCreator

logger = logging.getLogger(__name__)

class OwletSyncService:
    """Main orchestrator for Owlet data syncing"""
    
    def __init__(self, config_file='owlet_config.json'):
        self.config_loader = ConfigLoader(config_file)
        self.config = self.config_loader.config
        self.timezone = self.config_loader.timezone
        
        # Initialize components
        self.api_client = OwletAPIClient(self.config_loader)
        self.data_processor = VitalDataProcessor(self.timezone)
        self.file_manager = OwletFileManager(self.timezone)
        self.event_creator = EventCreator(self.config_loader)
        
        # State tracking
        self.last_sleep_state = None
        self.last_history_save_time = None
        self.last_daily_cleanup_time = None
        self.last_hourly_update_time = None
    
    async def authenticate(self):
        """Authenticate with Owlet API"""
        return await self.api_client.authenticate()
    
    async def fetch_device_data(self):
        """Fetch device data"""
        return await self.api_client.fetch_device_data()
    
    def should_perform_daily_cleanup(self):
        """Check if we should perform daily cleanup"""
        current_time = datetime.now(timezone.utc)
        
        if self.last_daily_cleanup_time is None:
            return True
        
        time_since_last = (current_time - self.last_daily_cleanup_time).total_seconds()
        return time_since_last >= 86400  # 24 hours
    
    def should_update_hourly(self):
        """Check if we should update hourly data"""
        current_time = datetime.now(timezone.utc).astimezone(self.timezone)
        
        if self.last_hourly_update_time is None:
            return True
        
        time_since_last = (current_time - self.last_hourly_update_time).total_seconds()
        return time_since_last >= 3600  # 1 hour
    
    def should_save_to_history(self, current_time):
        """Check if we should save to history"""
        if self.last_history_save_time is None:
            return True
        
        interval_seconds = self.config.get('history_interval_seconds', 60)
        time_since_last = (current_time - self.last_history_save_time).total_seconds()
        return time_since_last >= interval_seconds
    
    async def sync(self):
        """Main sync operation"""
        logger.info("Starting Owlet sync...")
        
        # Daily cleanup
        if self.should_perform_daily_cleanup():
            logger.info("Performing daily cleanup...")
            self.cleanup_yesterdays_data()
            self.last_daily_cleanup_time = datetime.now(timezone.utc)
        
        # Hourly update
        if self.should_update_hourly():
            logger.info("Updating today's hourly data...")
            self.update_todays_hourly()
            self.last_hourly_update_time = datetime.now(timezone.utc).astimezone(self.timezone)
        
        # Authenticate
        if not await self.authenticate():
            logger.error("Failed to authenticate")
            return False
        
        # Fetch device data
        sock = await self.fetch_device_data()
        if not sock:
            logger.warning("Failed to fetch device data")
            return False
        
        # Extract and save vital data
        vital = self.data_processor.extract_vital_data(sock)
        if vital:
            # Save real-time data
            self.file_manager.save_latest(vital)
            
            # Save to history if interval passed
            current_time = datetime.now(timezone.utc)
            if self.should_save_to_history(current_time):
                history = self.file_manager.load_history()
                history.insert(0, vital)
                
                # Cleanup old history
                retention_hours = self.config.get('retention_hours', 48)
                history = self.file_manager.cleanup_old_vitals(history, retention_hours)
                self.file_manager.save_history(history)
                self.last_history_save_time = current_time
                logger.info(f"Saved to history. Total entries: {len(history)}")
        
        # Auto-create sleep events
        if self.config.get('auto_create_events', True):
            current_sleep_state = self.data_processor.detect_sleep_state(sock)
            
            if current_sleep_state is not None and self.last_sleep_state is not None:
                if current_sleep_state and not self.last_sleep_state:
                    # Fell asleep
                    if self.event_creator.should_create_sleep_event('Sleep Start'):
                        self.event_creator.create_event('Sleep Start', '😴', 'Detected by Owlet')
                elif not current_sleep_state and self.last_sleep_state:
                    # Woke up
                    if self.event_creator.should_create_sleep_event('Sleep End'):
                        self.event_creator.create_event('Sleep End', '😴', 'Detected by Owlet')
            
            self.last_sleep_state = current_sleep_state
        
        logger.info("Sync completed successfully")
        return True
    
    def cleanup_yesterdays_data(self):
        """Archive yesterday's data into summary"""
        try:
            current_time = datetime.now(timezone.utc)
            yesterday = (current_time - timedelta(days=1)).date()
            
            yesterday_summary_file = self.file_manager.get_daily_summary_filename(yesterday)
            
            if not os.path.exists(yesterday_summary_file):
                logger.info("Creating yesterday's summary...")
                
                # Load history and filter for yesterday's data
                history = self.file_manager.load_history()
                yesterday_vitals = []
                yesterday_start = datetime.combine(yesterday, datetime.min.time(), tzinfo=timezone.utc)
                yesterday_end = datetime.combine(yesterday, datetime.max.time(), tzinfo=timezone.utc)
                
                for vital in history:
                    try:
                        vital_time = datetime.fromisoformat(vital['timestamp'].replace('Z', '+00:00'))
                        if yesterday_start <= vital_time <= yesterday_end:
                            yesterday_vitals.append(vital)
                    except Exception as e:
                        logger.warning(f"Could not parse timestamp: {e}")
                
                if yesterday_vitals:
                    summary = self.data_processor.aggregate_vitals_to_summary(yesterday_vitals)
                    if summary:
                        self.file_manager.save_daily_summary(summary, yesterday)
                        logger.info(f"Created yesterday's summary")
            
            logger.info("Daily cleanup completed")
        except Exception as e:
            logger.error(f"Error during cleanup: {e}")
    
    def update_todays_hourly(self):
        """Update today's hourly aggregated data"""
        try:
            current_time = datetime.now(timezone.utc).astimezone(self.timezone)
            current_hour = current_time.hour
            
            # Load history for past hour
            history = self.file_manager.load_history()
            if not history:
                logger.debug("No historical data for hourly update")
                return
            
            one_hour_ago = current_time - timedelta(hours=1)
            past_hour_vitals = []
            
            for vital in history:
                try:
                    vital_time = datetime.fromisoformat(vital['timestamp'].replace('Z', '+00:00'))
                    if vital_time >= one_hour_ago and vital_time <= current_time:
                        past_hour_vitals.append(vital)
                except:
                    pass
            
            if not past_hour_vitals:
                logger.debug("No data from past hour")
                return
            
            # Create hourly entry
            # TODO: Implement detailed hourly aggregation
            logger.info(f"Updated hour {current_hour}")
        except Exception as e:
            logger.error(f"Failed to update hourly: {e}")
    
    async def close(self):
        """Close connections"""
        await self.api_client.close()
    
    async def run_service(self):
        """Run service continuously"""
        sync_interval_seconds = self.config.get('sync_interval_seconds', 60)
        if sync_interval_seconds == 0:
            sync_interval_seconds = self.config.get('sync_interval_minutes', 1) * 60
        
        logger.info(f"Starting service (interval: {sync_interval_seconds}s)")
        
        try:
            while True:
                try:
                    await self.sync()
                except Exception as e:
                    logger.error(f"Error during sync: {e}")
                
                if sync_interval_seconds > 0:
                    await asyncio.sleep(sync_interval_seconds)
        except KeyboardInterrupt:
            logger.info("Service interrupted")
        finally:
            await self.close()

