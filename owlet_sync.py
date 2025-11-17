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
        self.vitals_file = 'owlet_vitals.json'
        self.api = None
        self.last_sleep_state = None
        self.session = None
        
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
        """Save vital signs to file"""
        try:
            with open(self.vitals_file, 'w') as f:
                json.dump(vitals, f, indent=2)
            logger.info(f"Saved {len(vitals)} vital readings")
        except Exception as e:
            logger.error(f"Failed to save vitals: {e}")
    
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
        
        # Extract and save vital data
        vital = self.extract_vital_data(sock)
        if vital:
            vitals = self.load_vitals()
            vitals.insert(0, vital)  # Add to front (most recent first)
            vitals = self.cleanup_old_vitals(vitals)
            self.save_vitals(vitals)
        
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
                    await self.sync()
                except Exception as e:
                    logger.error(f"Unexpected error during sync: {e}")
                
                logger.info(f"Next sync in {sync_interval_seconds} seconds")
                await asyncio.sleep(sync_interval_seconds)
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

