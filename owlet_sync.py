import asyncio
import json
import os
import sys
from datetime import datetime, timedelta
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
    level=logging.INFO,
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
        cutoff_time = datetime.utcnow() - timedelta(hours=retention_hours)
        
        filtered = []
        for vital in vitals:
            vital_time = datetime.fromisoformat(vital['timestamp'].replace('Z', '+00:00'))
            if vital_time > cutoff_time:
                filtered.append(vital)
        
        if len(filtered) < len(vitals):
            logger.info(f"Cleaned up {len(vitals) - len(filtered)} old vital readings")
        
        return filtered
    
    async def authenticate(self):
        """Authenticate with Owlet API"""
        try:
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
            return False
    
    async def fetch_device_data(self):
        """Fetch data from Owlet devices"""
        try:
            if not self.api:
                logger.error("API not authenticated")
                return None
            
            devices = await self.api.get_devices()
            if not devices:
                logger.warning("No devices found")
                return None
            
            # Get first device (usually only one sock)
            device_data = devices[0]['device']
            sock = Sock(self.api, device_data)
            await sock.update_properties()
            
            logger.info(f"Fetched data for device: {device_data.get('dsn')}")
            return sock
        except Exception as e:
            logger.error(f"Failed to fetch device data: {e}")
            return None
    
    def extract_vital_data(self, sock):
        """Extract vital signs from sock data"""
        try:
            props = sock.properties if hasattr(sock, 'properties') else {}
            
            vital = {
                'timestamp': datetime.utcnow().isoformat() + 'Z',
                'heart_rate': props.get('heart_rate'),
                'oxygen_level': props.get('oxygen_level'),
                'movement': props.get('movement'),
                'battery': props.get('battery'),
                'sock_connected': props.get('sock_on'),
                'low_battery': props.get('low_battery'),
                'high_heart_rate': props.get('high_heart_rate'),
                'low_oxygen': props.get('low_oxygen'),
            }
            
            logger.info(f"Extracted vitals: HR={vital['heart_rate']}, O2={vital['oxygen_level']}, Battery={vital['battery']}%")
            return vital
        except Exception as e:
            logger.error(f"Failed to extract vital data: {e}")
            return None
    
    def detect_sleep_state(self, sock):
        """Detect if baby is asleep based on Owlet data and recent vitals"""
        try:
            props = sock.properties if hasattr(sock, 'properties') else {}
            
            # First check if Owlet has native sleep detection
            is_sleeping = props.get('sleeping', False)
            
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
                time_diff = datetime.utcnow() - last_time.replace(tzinfo=None)
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
            event_id = int(datetime.utcnow().timestamp() * 1000)
            event_data = {
                'id': event_id,
                'type': event_type,
                'icon': icon,
                'time': datetime.utcnow().isoformat() + 'Z',
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
        
        # Authenticate
        if not await self.authenticate():
            logger.error("Failed to authenticate with Owlet")
            return False
        
        # Fetch device data
        sock = await self.fetch_device_data()
        if not sock:
            logger.error("Failed to fetch device data")
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
    
    async def run_service(self):
        """Run the service continuously"""
        sync_interval = self.config.get('sync_interval_minutes', 15)
        sync_interval_seconds = sync_interval * 60
        
        logger.info(f"Starting Owlet sync service (interval: {sync_interval} minutes)")
        
        while True:
            try:
                await self.sync()
            except Exception as e:
                logger.error(f"Unexpected error during sync: {e}")
            
            logger.info(f"Next sync in {sync_interval} minutes")
            await asyncio.sleep(sync_interval_seconds)

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

