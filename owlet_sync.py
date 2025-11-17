import asyncio
import json
import os
import sys
from datetime import datetime, timedelta, timezone
import logging
from pathlib import Path
import requests

try:
    from pyowletapi.api import OwletAPI
    from pyowletapi.sock import Sock
except ImportError:
    print("ERROR: pyowletapi not installed. Run: pip install pyowletapi requests")
    sys.exit(1)

try:
    import pytz
except ImportError:
    print("ERROR: pytz not installed. Run: pip install pytz")
    sys.exit(1)

# Setup logging
logging.basicConfig(
    level=logging.DEBUG,  # Changed to DEBUG for detailed troubleshooting
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('owlet_sync.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class OwletSyncService:
    def __init__(self, config_file='owlet_config.json'):
        self.config_file = config_file
        self.config = self.load_config()
        self.vitals_file = 'owlet_vitals.json'  # Deprecated, kept for compatibility
        self.latest_file = 'owlet_latest.json'  # Real-time data (single entry)
        self.history_file = 'owlet_history.json'  # Historical data (minute-interval only)
        self.daily_summaries_dir = 'owlet_daily_summaries'  # Directory for daily summaries
        self.todays_hourly_file = 'owlet_todays_hourly.json'  # Today's hourly data (accumulates throughout the day)
        self.api = None
        self.last_sleep_state = None
        self.session = None
        self.last_history_save_time = None  # Track last time we saved to history
        self.last_daily_cleanup_time = None  # Track last time we cleaned up old data
        self.last_hourly_update_time = None  # Track last time we updated today's hourly data
        
        # Ensure daily summaries directory exists
        Path(self.daily_summaries_dir).mkdir(exist_ok=True)
        
        # Initialize timezone (default to UTC, can be overridden by config)
        self.timezone = self._get_timezone()
    
    def _get_timezone(self):
        """Get timezone from config or default to UTC"""
        if not self.config:
            return pytz.UTC
        
        timezone_str = self.config.get('timezone', 'UTC')
        try:
            return pytz.timezone(timezone_str)
        except Exception as e:
            logger.warning(f"Invalid timezone '{timezone_str}' in config, defaulting to UTC: {e}")
            return pytz.UTC
    
    def get_local_time(self):
        """Get current time in the configured timezone"""
        return datetime.now(timezone.utc).astimezone(self.timezone)
        
    def load_config(self):
        """Load configuration from JSON file"""
        if not os.path.exists(self.config_file):
            logger.error(f"Config file {self.config_file} not found")
            return None
        
        try:
            with open(self.config_file, 'r') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Failed to load config: {e}")
            return None
    
    def load_vitals(self):
        """Load existing vital signs"""
        if not os.path.exists(self.vitals_file):
            return []
        
        try:
            with open(self.vitals_file, 'r') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Failed to load vitals: {e}")
            return []
    
    def save_vitals(self, vitals):
        """Save vital signs to file (deprecated, kept for compatibility)"""
        try:
            with open(self.vitals_file, 'w') as f:
                json.dump(vitals, f, indent=2)
            logger.info(f"Saved {len(vitals)} vital readings")
        except Exception as e:
            logger.error(f"Failed to save vitals: {e}")
    
    def save_latest(self, vital):
        """Save only the latest vital reading (real-time data)"""
        try:
            with open(self.latest_file, 'w') as f:
                json.dump(vital, f, indent=2)
            logger.info(f"Saved latest vital reading: HR={vital.get('heart_rate')}, O2={vital.get('oxygen_saturation')}%")
        except Exception as e:
            logger.error(f"Failed to save latest vital: {e}")
    
    def load_history(self):
        """Load existing historical vital signs"""
        if not os.path.exists(self.history_file):
            return []
        
        try:
            with open(self.history_file, 'r') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Failed to load history: {e}")
            return []
    
    def save_history(self, history):
        """Save historical vital readings to file"""
        try:
            with open(self.history_file, 'w') as f:
                json.dump(history, f, indent=2)
            logger.info(f"Saved {len(history)} historical vital readings")
        except Exception as e:
            logger.error(f"Failed to save history: {e}")
    
    def cleanup_old_vitals(self, vitals):
        """Remove vital signs older than retention period"""
        retention_hours = self.config.get('retention_hours', 48)
        # Use timezone-aware UTC time for comparison
        cutoff_time = datetime.now(timezone.utc) - timedelta(hours=retention_hours)
        
        filtered = []
        for vital in vitals:
            try:
                # Parse timestamp and ensure it's timezone-aware
                vital_time = datetime.fromisoformat(vital['timestamp'].replace('Z', '+00:00'))
                if vital_time > cutoff_time:
                    filtered.append(vital)
            except Exception as e:
                logger.warning(f"Could not parse vital timestamp: {vital.get('timestamp')}, {e}")
                # Keep vital if we can't parse timestamp
                filtered.append(vital)
        
        if len(filtered) < len(vitals):
            logger.info(f"Cleaned up {len(vitals) - len(filtered)} old vital readings")
        
        return filtered
    
    def get_daily_summary_filename(self, date=None):
        """Get the filename for a daily summary based on date (in the configured timezone)"""
        if date is None:
            date = self.get_local_time().date()
        elif isinstance(date, datetime):
            date = date.date()
        
        return os.path.join(self.daily_summaries_dir, f"owlet_summary_{date.isoformat()}.json")
    
    def aggregate_vitals_to_summary(self, vitals):
        """Aggregate minute-by-minute vital readings into a daily summary with hourly statistics"""
        if not vitals:
            return None
        
        try:
            # First, organize vitals by hour (0-23)
            hourly_vitals = {hour: [] for hour in range(24)}
            
            for vital in vitals:
                try:
                    vital_time = datetime.fromisoformat(vital['timestamp'].replace('Z', '+00:00'))
                    # Convert UTC time to local timezone for hour calculation
                    vital_time_local = vital_time.astimezone(self.timezone)
                    hour = vital_time_local.hour
                    hourly_vitals[hour].append(vital)
                except Exception as e:
                    logger.warning(f"Could not parse vital timestamp for hourly aggregation: {vital.get('timestamp')}, {e}")
            
            # Helper function to aggregate metrics for a list of vitals
            def aggregate_metrics(vitals_list):
                """Aggregate metrics from a list of vitals"""
                if not vitals_list:
                    return None
                
                heart_rates = [v.get('heart_rate') for v in vitals_list if v.get('heart_rate') is not None]
                oxygen_sats = [v.get('oxygen_saturation') for v in vitals_list if v.get('oxygen_saturation') is not None]
                oxygen_10_avs = [v.get('oxygen_10_av') for v in vitals_list if v.get('oxygen_10_av') is not None]
                movements = [v.get('movement') for v in vitals_list if v.get('movement') is not None]
                temperatures = [v.get('skin_temperature') for v in vitals_list if v.get('skin_temperature') is not None]
                battery_percentages = [v.get('battery_percentage') for v in vitals_list if v.get('battery_percentage') is not None]
                
                low_battery_count = sum(1 for v in vitals_list if v.get('low_battery'))
                high_hr_count = sum(1 for v in vitals_list if v.get('high_heart_rate'))
                low_ox_count = sum(1 for v in vitals_list if v.get('low_oxygen'))
                disconnect_count = sum(1 for v in vitals_list if not v.get('sock_connected', True))
                
                sleep_count = sum(1 for v in vitals_list if v.get('sleep_state') == 2)
                awake_count = sum(1 for v in vitals_list if v.get('sleep_state') == 1)
                
                return {
                    'data_points': len(vitals_list),
                    'heart_rate': {
                        'avg': round(sum(heart_rates) / len(heart_rates), 1) if heart_rates else None,
                        'min': min(heart_rates) if heart_rates else None,
                        'max': max(heart_rates) if heart_rates else None,
                    },
                    'oxygen_saturation': {
                        'avg': round(sum(oxygen_sats) / len(oxygen_sats), 1) if oxygen_sats else None,
                        'min': min(oxygen_sats) if oxygen_sats else None,
                        'max': max(oxygen_sats) if oxygen_sats else None,
                    },
                    'oxygen_10_av': {
                        'avg': round(sum(oxygen_10_avs) / len(oxygen_10_avs), 1) if oxygen_10_avs else None,
                        'min': min(oxygen_10_avs) if oxygen_10_avs else None,
                        'max': max(oxygen_10_avs) if oxygen_10_avs else None,
                    },
                    'movement': {
                        'avg': round(sum(movements) / len(movements), 1) if movements else None,
                        'min': min(movements) if movements else None,
                        'max': max(movements) if movements else None,
                    },
                    'skin_temperature': {
                        'avg': round(sum(temperatures) / len(temperatures), 2) if temperatures else None,
                        'min': round(min(temperatures), 2) if temperatures else None,
                        'max': round(max(temperatures), 2) if temperatures else None,
                    },
                    'battery_percentage': {
                        'avg': round(sum(battery_percentages) / len(battery_percentages), 1) if battery_percentages else None,
                        'min': min(battery_percentages) if battery_percentages else None,
                        'max': max(battery_percentages) if battery_percentages else None,
                    },
                    'alerts': {
                        'low_battery': low_battery_count,
                        'high_heart_rate': high_hr_count,
                        'low_oxygen': low_ox_count,
                        'disconnections': disconnect_count
                    },
                    'sleep': {
                        'asleep': sleep_count,
                        'awake': awake_count,
                    }
                }
            
            # Build hourly data array
            hourly_data = []
            for hour in range(24):
                if hourly_vitals[hour]:
                    hour_agg = aggregate_metrics(hourly_vitals[hour])
                    hour_agg['hour'] = hour
                    hourly_data.append(hour_agg)
                else:
                    # Include empty hour for completeness
                    hourly_data.append({
                        'hour': hour,
                        'data_points': 0
                    })
            
            # Get daily aggregates for quick reference
            daily_agg = aggregate_metrics(vitals)
            
            # Extract numeric values for daily averages
            heart_rates = [v.get('heart_rate') for v in vitals if v.get('heart_rate') is not None]
            oxygen_sats = [v.get('oxygen_saturation') for v in vitals if v.get('oxygen_saturation') is not None]
            temperatures = [v.get('skin_temperature') for v in vitals if v.get('skin_temperature') is not None]
            
            # Build final summary
            # Determine date from the first (most recent) vital in local timezone
            try:
                first_vital_time = datetime.fromisoformat(vitals[0]['timestamp'].replace('Z', '+00:00'))
                first_vital_local = first_vital_time.astimezone(self.timezone)
                summary_date = first_vital_local.strftime('%Y-%m-%d')
            except Exception as e:
                logger.warning(f"Could not determine summary date, using UTC: {e}")
                summary_date = vitals[0]['timestamp'][:10]
            
            summary = {
                'date': summary_date,  # YYYY-MM-DD in local timezone
                'total_data_points': len(vitals),
                'first_timestamp': vitals[-1]['timestamp'],  # Last one is oldest
                'last_timestamp': vitals[0]['timestamp'],   # First one is newest
                'daily': daily_agg,  # Daily aggregates
                'hourly': hourly_data  # Hourly breakdown (24 entries, one per hour)
            }
            
            return summary
        except Exception as e:
            logger.error(f"Failed to aggregate vitals to summary: {e}")
            import traceback
            logger.debug(f"Full traceback: {traceback.format_exc()}")
            return None
    
    def save_daily_summary(self, summary, date=None):
        """Save a daily summary to file"""
        try:
            filename = self.get_daily_summary_filename(date)
            with open(filename, 'w') as f:
                json.dump(summary, f, indent=2)
            logger.info(f"Saved daily summary: {filename} ({summary['data_points']} data points)")
            return True
        except Exception as e:
            logger.error(f"Failed to save daily summary: {e}")
            return False
    
    def load_todays_hourly(self):
        """Load today's hourly data from file (using configured timezone)"""
        if not os.path.exists(self.todays_hourly_file):
            return {
                'date': self.get_local_time().strftime('%Y-%m-%d'),
                'hourly': []
            }
        
        try:
            with open(self.todays_hourly_file, 'r') as f:
                data = json.load(f)
                # Verify it's today's data
                today_str = self.get_local_time().strftime('%Y-%m-%d')
                if data.get('date') != today_str:
                    # New day, reset
                    return {
                        'date': today_str,
                        'hourly': []
                    }
                return data
        except Exception as e:
            logger.warning(f"Failed to load today's hourly data: {e}")
            return {
                'date': self.get_local_time().strftime('%Y-%m-%d'),
                'hourly': []
            }
    
    def save_todays_hourly(self, data):
        """Save today's hourly data to file"""
        try:
            with open(self.todays_hourly_file, 'w') as f:
                json.dump(data, f, indent=2)
            logger.info(f"Saved today's hourly data: {len(data.get('hourly', []))} hours")
            return True
        except Exception as e:
            logger.error(f"Failed to save today's hourly data: {e}")
            return False
    
    def should_update_hourly(self):
        """Check if we should update today's hourly data (every hour in the configured timezone)"""
        current_time = self.get_local_time()
        
        if self.last_hourly_update_time is None:
            # First time, always update
            return True
        
        # Check if an hour has passed
        time_since_last_update = (current_time - self.last_hourly_update_time).total_seconds()
        # Update once per hour (3600 seconds)
        return time_since_last_update >= 3600
    
    def update_todays_hourly(self):
        """
        Calculate and update today's hourly data.
        Gets the past hour of minute-by-minute history data and creates an hourly average.
        Uses the configured timezone for hour calculations.
        """
        try:
            current_time = self.get_local_time()
            current_hour = current_time.hour
            
            # Load history data
            history = self.load_history()
            if not history:
                logger.debug("No historical data available for hourly update")
                return
            
            # Calculate the time range for the past hour
            # We want to include data from: (current_hour - 1) to current_hour
            one_hour_ago = current_time - timedelta(hours=1)
            
            # Filter history for the past hour
            past_hour_vitals = []
            for vital in history:
                try:
                    vital_time = datetime.fromisoformat(vital['timestamp'].replace('Z', '+00:00'))
                    if vital_time >= one_hour_ago and vital_time <= current_time:
                        past_hour_vitals.append(vital)
                except Exception as e:
                    logger.warning(f"Could not parse vital timestamp for hourly update: {vital.get('timestamp')}, {e}")
            
            if not past_hour_vitals:
                logger.debug(f"No data from past hour for hourly update")
                return
            
            # Helper function to aggregate metrics (same as in daily summary)
            def aggregate_metrics(vitals_list):
                """Aggregate metrics from a list of vitals"""
                if not vitals_list:
                    return None
                
                heart_rates = [v.get('heart_rate') for v in vitals_list if v.get('heart_rate') is not None]
                oxygen_sats = [v.get('oxygen_saturation') for v in vitals_list if v.get('oxygen_saturation') is not None]
                oxygen_10_avs = [v.get('oxygen_10_av') for v in vitals_list if v.get('oxygen_10_av') is not None]
                movements = [v.get('movement') for v in vitals_list if v.get('movement') is not None]
                temperatures = [v.get('skin_temperature') for v in vitals_list if v.get('skin_temperature') is not None]
                battery_percentages = [v.get('battery_percentage') for v in vitals_list if v.get('battery_percentage') is not None]
                
                low_battery_count = sum(1 for v in vitals_list if v.get('low_battery'))
                high_hr_count = sum(1 for v in vitals_list if v.get('high_heart_rate'))
                low_ox_count = sum(1 for v in vitals_list if v.get('low_oxygen'))
                disconnect_count = sum(1 for v in vitals_list if not v.get('sock_connected', True))
                
                sleep_count = sum(1 for v in vitals_list if v.get('sleep_state') == 2)
                awake_count = sum(1 for v in vitals_list if v.get('sleep_state') == 1)
                
                return {
                    'data_points': len(vitals_list),
                    'heart_rate': {
                        'avg': round(sum(heart_rates) / len(heart_rates), 1) if heart_rates else None,
                        'min': min(heart_rates) if heart_rates else None,
                        'max': max(heart_rates) if heart_rates else None,
                    },
                    'oxygen_saturation': {
                        'avg': round(sum(oxygen_sats) / len(oxygen_sats), 1) if oxygen_sats else None,
                        'min': min(oxygen_sats) if oxygen_sats else None,
                        'max': max(oxygen_sats) if oxygen_sats else None,
                    },
                    'oxygen_10_av': {
                        'avg': round(sum(oxygen_10_avs) / len(oxygen_10_avs), 1) if oxygen_10_avs else None,
                        'min': min(oxygen_10_avs) if oxygen_10_avs else None,
                        'max': max(oxygen_10_avs) if oxygen_10_avs else None,
                    },
                    'movement': {
                        'avg': round(sum(movements) / len(movements), 1) if movements else None,
                        'min': min(movements) if movements else None,
                        'max': max(movements) if movements else None,
                    },
                    'skin_temperature': {
                        'avg': round(sum(temperatures) / len(temperatures), 2) if temperatures else None,
                        'min': round(min(temperatures), 2) if temperatures else None,
                        'max': round(max(temperatures), 2) if temperatures else None,
                    },
                    'battery_percentage': {
                        'avg': round(sum(battery_percentages) / len(battery_percentages), 1) if battery_percentages else None,
                        'min': min(battery_percentages) if battery_percentages else None,
                        'max': max(battery_percentages) if battery_percentages else None,
                    },
                    'alerts': {
                        'low_battery': low_battery_count,
                        'high_heart_rate': high_hr_count,
                        'low_oxygen': low_ox_count,
                        'disconnections': disconnect_count
                    },
                    'sleep': {
                        'asleep': sleep_count,
                        'awake': awake_count,
                    }
                }
            
            # Create hourly entry for the past hour
            hour_agg = aggregate_metrics(past_hour_vitals)
            hour_agg['hour'] = current_hour - 1 if current_hour > 0 else 23  # The hour we just completed
            hour_agg['timestamp_start'] = one_hour_ago.isoformat().replace('+00:00', 'Z')
            hour_agg['timestamp_end'] = current_time.isoformat().replace('+00:00', 'Z')
            
            # Load today's hourly data
            todays_hourly = self.load_todays_hourly()
            
            # Check if we already have data for this hour
            hour_index = -1
            for idx, entry in enumerate(todays_hourly.get('hourly', [])):
                if entry.get('hour') == hour_agg['hour']:
                    hour_index = idx
                    break
            
            # Add or update the hourly entry
            if hour_index >= 0:
                todays_hourly['hourly'][hour_index] = hour_agg
                logger.info(f"Updated hour {hour_agg['hour']} in today's hourly data ({len(past_hour_vitals)} data points)")
            else:
                todays_hourly['hourly'].append(hour_agg)
                # Sort by hour to keep it organized
                todays_hourly['hourly'].sort(key=lambda x: x.get('hour', 0))
                logger.info(f"Added hour {hour_agg['hour']} to today's hourly data ({len(past_hour_vitals)} data points)")
            
            # Update metadata
            todays_hourly['last_update'] = current_time.isoformat().replace('+00:00', 'Z')
            todays_hourly['total_hours'] = len(todays_hourly.get('hourly', []))
            
            # Save the updated data
            self.save_todays_hourly(todays_hourly)
            
        except Exception as e:
            logger.error(f"Failed to update today's hourly data: {e}")
            import traceback
            logger.debug(f"Full traceback: {traceback.format_exc()}")
    
    def load_daily_summary(self, date=None):
        """Load a daily summary from file"""
        try:
            filename = self.get_daily_summary_filename(date)
            if not os.path.exists(filename):
                return None
            
            with open(filename, 'r') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Failed to load daily summary: {e}")
            return None
    
    def should_perform_daily_cleanup(self):
        """Check if we should perform daily cleanup (once per day)"""
        current_time = datetime.now(timezone.utc)
        
        if self.last_daily_cleanup_time is None:
            # First time - always perform
            return True
        
        # Check if a day has passed
        time_since_last_cleanup = (current_time - self.last_daily_cleanup_time).total_seconds()
        # Perform cleanup once per day (86400 seconds)
        return time_since_last_cleanup >= 86400
    
    def cleanup_yesterdays_data(self):
        """
        Check if yesterday's summary exists. If yes, delete yesterday's minute-by-minute data.
        If no, create yesterday's summary from history, then delete the minute-by-minute data.
        """
        try:
            current_time = datetime.now(timezone.utc)
            yesterday = (current_time - timedelta(days=1)).date()
            
            yesterday_summary_file = self.get_daily_summary_filename(yesterday)
            
            # Check if yesterday's summary already exists
            if os.path.exists(yesterday_summary_file):
                logger.info(f"Yesterday's summary already exists: {yesterday_summary_file}")
            else:
                logger.info(f"Yesterday's summary not found. Creating from historical data...")
                
                # Load history to check for yesterday's data
                history = self.load_history()
                if not history:
                    logger.warning("No historical data available to create yesterday's summary")
                    return
                
                # Filter history for yesterday's data only
                yesterday_vitals = []
                yesterday_start = datetime.combine(yesterday, datetime.min.time(), tzinfo=timezone.utc)
                yesterday_end = datetime.combine(yesterday, datetime.max.time(), tzinfo=timezone.utc)
                
                for vital in history:
                    try:
                        vital_time = datetime.fromisoformat(vital['timestamp'].replace('Z', '+00:00'))
                        if yesterday_start <= vital_time <= yesterday_end:
                            yesterday_vitals.append(vital)
                    except Exception as e:
                        logger.warning(f"Could not parse vital timestamp: {vital.get('timestamp')}, {e}")
                
                if yesterday_vitals:
                    logger.info(f"Found {len(yesterday_vitals)} data points for yesterday")
                    summary = self.aggregate_vitals_to_summary(yesterday_vitals)
                    if summary:
                        self.save_daily_summary(summary, yesterday)
                        logger.info(f"Created yesterday's summary with {summary['data_points']} data points")
                else:
                    logger.info("No historical data found for yesterday")
            
            logger.info(f"Daily cleanup completed at {current_time.isoformat()}")
            
        except Exception as e:
            logger.error(f"Error during daily cleanup: {e}")
            import traceback
            logger.debug(f"Full traceback: {traceback.format_exc()}")
    
    async def authenticate(self):
        """Authenticate with Owlet API"""
        try:
            # If already authenticated, return True
            if self.api is not None:
                return True
            
            region = self.config.get('region', 'us-east-1')
            email = self.config.get('email')
            password = self.config.get('password')
            
            if not email or not password:
                logger.error("Email or password not configured")
                return False
            
            self.api = OwletAPI(region, email, password)
            await self.api.authenticate()
            logger.info("Successfully authenticated with Owlet API")
            return True
        except Exception as e:
            logger.error(f"Authentication failed: {e}")
            self.api = None
            return False
    
    async def fetch_device_data(self):
        """Fetch data from Owlet devices"""
        try:
            if not self.api:
                logger.error("API not authenticated")
                return None
            
            try:
                devices = await self.api.get_devices()
            except Exception as e:
                logger.error(f"Failed to get devices: {e}")
                # Reset API instance on error to force re-authentication next time
                self.api = None
                return None
            
            # Handle response wrapper (API returns {'response': [...]})
            if isinstance(devices, dict) and 'response' in devices:
                devices_list = devices['response']
                logger.debug(f"Extracted devices from response wrapper: {len(devices_list)} device(s)")
            else:
                devices_list = devices
            
            if not devices_list or len(devices_list) == 0:
                logger.warning("No devices found")
                return None
            
            # Get first device (usually only one sock)
            try:
                logger.debug(f"First device structure: {devices_list[0]}")
                
                # Extract device data
                if isinstance(devices_list[0], dict) and 'device' in devices_list[0]:
                    device_data = devices_list[0]['device']
                    logger.debug(f"Extracted device from wrapper")
                else:
                    device_data = devices_list[0]
                
                logger.debug(f"Device data: {device_data}")
                
                if not device_data:
                    logger.error(f"Invalid device data")
                    return None
                
                logger.info(f"Creating Sock object for device: {device_data.get('dsn', 'unknown')}")
                sock = Sock(self.api, device_data)
                
                logger.debug(f"Updating sock properties...")
                await sock.update_properties()
                
                logger.info(f"Successfully fetched data for device: {device_data.get('dsn', 'unknown')}")
                return sock
            except Exception as e:
                logger.error(f"Error processing device: {e}")
                logger.debug(f"Devices content: {devices_list}")
                import traceback
                logger.debug(f"Full traceback: {traceback.format_exc()}")
                return None
                
        except Exception as e:
            logger.error(f"Failed to fetch device data: {e}")
            return None
    
    def extract_vital_data(self, sock):
        """Extract vital signs from sock data"""
        try:
            props = sock.properties if hasattr(sock, 'properties') else {}
            
            # Use timezone-aware UTC time
            vital = {
                'timestamp': datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z'),
                'heart_rate': props.get('heart_rate'),
                'oxygen_saturation': props.get('oxygen_saturation'),
                'oxygen_10_av': props.get('oxygen_10_av'),
                'movement': props.get('movement'),
                'movement_bucket': props.get('movement_bucket'),
                'battery_percentage': props.get('battery_percentage'),
                'battery_minutes': props.get('battery_minutes'),
                'signal_strength': props.get('signal_strength'),
                'skin_temperature': props.get('skin_temperature'),
                'sleep_state': props.get('sleep_state'),
                'sock_connected': not props.get('sock_disconnected', False),  # True if NOT disconnected
                'sock_on': not props.get('sock_off', False),  # True if NOT off
                'low_battery': props.get('low_battery_alert'),
                'high_heart_rate': props.get('high_heart_rate_alert'),
                'low_oxygen': props.get('low_oxygen_alert'),
                'charging': props.get('charging'),
                'base_station_on': props.get('base_station_on'),
                'skin_temp': props.get('skin_temperature'),
            }
            
            logger.info(f"Extracted vitals: HR={vital['heart_rate']}, O2={vital['oxygen_saturation']}%, Battery={vital['battery_percentage']}% ({vital['battery_minutes']} min), Connected={vital['sock_connected']}, Temp={vital['skin_temperature']}C, Sleep={vital['sleep_state']}")
            logger.debug(f"Sleep state value: {vital['sleep_state']} (type: {type(vital['sleep_state'])})")
            return vital
        except Exception as e:
            logger.error(f"Failed to extract vital data: {e}")
            import traceback
            logger.debug(f"Full traceback: {traceback.format_exc()}")
            return None
    
    def detect_sleep_state(self, sock):
        """Detect if baby is asleep based on Owlet data and recent vitals"""
        try:
            props = sock.properties if hasattr(sock, 'properties') else {}
            
            # Check Owlet's sleep_state: 0=unknown, 1=awake, 2=asleep
            sleep_state = props.get('sleep_state', 0)
            is_sleeping = sleep_state == 2  # 2 means asleep
            
            # Enhanced detection: use heart rate and movement patterns
            if not is_sleeping and self.config.get('sleep_detection_enabled', True):
                vitals = self.load_vitals()
                if len(vitals) >= 3:
                    # Check last 3 readings for consistent low movement/heart rate
                    recent_vitals = vitals[:3]
                    avg_hr = sum(v.get('heart_rate', 0) or 0 for v in recent_vitals) / len(recent_vitals)
                    avg_movement = sum(v.get('movement', 0) or 0 for v in recent_vitals) / len(recent_vitals)
                    
                    hr_low = self.config.get('sleep_detection_threshold_hr_low', 60)
                    hr_high = self.config.get('sleep_detection_threshold_hr_high', 120)
                    movement_threshold = self.config.get('sleep_detection_movement_threshold', 10)
                    
                    # Consider asleep if HR is stable and movement is low
                    if hr_low <= avg_hr <= hr_high and avg_movement < movement_threshold:
                        is_sleeping = True
            
            return is_sleeping
        except Exception as e:
            logger.error(f"Failed to detect sleep state: {e}")
            return None
    
    def should_create_sleep_event(self, event_type):
        """Check if we should create a sleep event (prevent duplicates)"""
        try:
            php_endpoint = self.config.get('php_api_endpoint', 'http://localhost/events.php')
            response = requests.get(php_endpoint)
            if response.status_code != 200:
                return True
            
            events = response.json()
            if not events:
                return True
            
            # Check if the most recent event is the same type (within 5 minutes)
            last_event = events[0]
            if last_event.get('type') == event_type:
                last_time = datetime.fromisoformat(last_event.get('time', '').replace('Z', '+00:00'))
                now_utc = datetime.now(timezone.utc)
                time_diff = now_utc - last_time
                if time_diff.total_seconds() < 300:  # 5 minutes
                    logger.info(f"Skipping duplicate {event_type} event")
                    return False
            
            return True
        except Exception as e:
            logger.warning(f"Could not check for duplicate events: {e}")
            return True
    
    def create_event(self, event_type, icon, notes=""):
        """Create an event in the backend API"""
        try:
            # Use timezone-aware UTC time
            now_utc = datetime.now(timezone.utc)
            event_id = int(now_utc.timestamp() * 1000)
            event_data = {
                'id': event_id,
                'type': event_type,
                'icon': icon,
                'time': now_utc.isoformat().replace('+00:00', 'Z'),
                'notes': notes
            }
            
            # Get PHP API endpoint from config
            php_endpoint = self.config.get('php_api_endpoint', 'http://localhost/events.php')
            
            response = requests.post(php_endpoint, json=event_data)
            if response.status_code == 200:
                logger.info(f"Created event: {event_type}")
                return True
            else:
                logger.error(f"Failed to create event: {response.text}")
                return False
        except Exception as e:
            logger.error(f"Error creating event: {e}")
            return False
    
    async def sync(self):
        """Main sync function"""
        logger.info("Starting Owlet sync...")
        
        # Perform daily cleanup if needed (check and archive yesterday's data)
        if self.should_perform_daily_cleanup():
            logger.info("Performing daily cleanup...")
            self.cleanup_yesterdays_data()
            self.last_daily_cleanup_time = datetime.now(timezone.utc)
        
        # Update today's hourly data if needed (every hour)
        if self.should_update_hourly():
            logger.info("Updating today's hourly data...")
            self.update_todays_hourly()
            self.last_hourly_update_time = datetime.now(timezone.utc)
        
        # Authenticate (only needed if not already authenticated)
        if not self.api:
            if not await self.authenticate():
                logger.error("Failed to authenticate with Owlet")
                return False
        
        # Fetch device data
        sock = await self.fetch_device_data()
        if not sock:
            logger.warning("Failed to fetch device data - will retry next sync")
            return False
        
        # Extract vital data
        vital = self.extract_vital_data(sock)
        if vital:
            # Save real-time data (latest only)
            self.save_latest(vital)
            
            # Save to legacy vitals file for backward compatibility
            vitals = self.load_vitals()
            vitals.insert(0, vital)
            if self.config.get('retention_enabled', True):
                vitals = self.cleanup_old_vitals(vitals)
            self.save_vitals(vitals)
            
            # Save to historical data if minute interval has passed
            history_interval_seconds = self.config.get('history_interval_seconds', 60)
            current_time = datetime.now(timezone.utc)
            
            # Check if we should save to history (once per minute by default)
            should_save_history = False
            if self.last_history_save_time is None:
                # First time, always save
                should_save_history = True
            else:
                time_since_last_save = (current_time - self.last_history_save_time).total_seconds()
                if time_since_last_save >= history_interval_seconds:
                    should_save_history = True
            
            if should_save_history:
                history = self.load_history()
                history.insert(0, vital)
                # Cleanup old history entries
                retention_hours = self.config.get('retention_hours', 48)
                cutoff_time = current_time - timedelta(hours=retention_hours)
                history = [h for h in history if datetime.fromisoformat(h['timestamp'].replace('Z', '+00:00')) > cutoff_time]
                self.save_history(history)
                self.last_history_save_time = current_time
                logger.info(f"Saved to historical data. Total history entries: {len(history)}")
        
        # Detect sleep state and create events if needed
        if self.config.get('auto_create_events', True):
            current_sleep_state = self.detect_sleep_state(sock)
            
            if current_sleep_state is not None and self.last_sleep_state is not None:
                # Check for state change
                if current_sleep_state and not self.last_sleep_state:
                    # Baby fell asleep
                    if self.should_create_sleep_event('Sleep Start'):
                        self.create_event('Sleep Start', '😴', 'Detected by Owlet')
                elif not current_sleep_state and self.last_sleep_state:
                    # Baby woke up
                    if self.should_create_sleep_event('Sleep End'):
                        self.create_event('Sleep End', '😴', 'Detected by Owlet')
            
            self.last_sleep_state = current_sleep_state
        
        logger.info("Sync completed successfully")
        return True
    
    async def close(self):
        """Close API session"""
        if self.api:
            try:
                # Close the aiohttp session if it exists
                if hasattr(self.api, 'session') and self.api.session:
                    await self.api.session.close()
                self.api = None
                logger.info("API session closed")
            except Exception as e:
                logger.warning(f"Error closing API session: {e}")
    
    async def run_service(self):
        """Run the service continuously"""
        # Support both minutes and seconds for flexibility
        if 'sync_interval_seconds' in self.config:
            sync_interval_seconds = self.config.get('sync_interval_seconds', 60)
            logger.info(f"Starting Owlet sync service (interval: {sync_interval_seconds} seconds)")
        else:
            sync_interval = self.config.get('sync_interval_minutes', 1)
            sync_interval_seconds = sync_interval * 60
            logger.info(f"Starting Owlet sync service (interval: {sync_interval} minutes = {sync_interval_seconds} seconds)")
        
        try:
            while True:
                try:
                    # Wait for sync to complete before starting the next one
                    # This prevents stacking calls
                    await self.sync()
                except Exception as e:
                    logger.error(f"Unexpected error during sync: {e}")
                
                # Only sleep if sync_interval_seconds is > 0
                if sync_interval_seconds > 0:
                    logger.debug(f"Waiting {sync_interval_seconds} seconds before next sync")
                    await asyncio.sleep(sync_interval_seconds)
                else:
                    # If interval is 0, immediately start the next sync
                    logger.debug("Starting next sync immediately (no delay)")
        except KeyboardInterrupt:
            logger.info("Service interrupted by user")
        finally:
            await self.close()

async def main():
    service = OwletSyncService()
    
    if service.config is None:
        logger.error("Cannot start service without valid config")
        return
    
    await service.run_service()

if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Service stopped by user")
    except Exception as e:
        logger.error(f"Fatal error: {e}")
        sys.exit(1)

