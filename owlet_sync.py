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
    level=logging.INFO,  # INFO level - only show important messages
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
        self.latest_file = 'owlet_latest.json'  # Real-time data (single entry)
        self.minutes_dir = 'owlet_minutes'  # Directory for daily minute data
        self.daily_summaries_dir = 'owlet_daily_summaries'  # Directory for daily summaries
        self.todays_hourly_file = 'owlet_todays_hourly.json'  # Today's hourly data (accumulates throughout the day)
        self.api = None
        self.last_sleep_state = None
        self.session = None
        self.last_daily_cleanup_time = None  # Track last time we cleaned up old data
        self.last_hourly_update_time = None  # Track last time we updated today's hourly data
        
        # Minute buffer system - accumulates readings during each minute
        self.minute_buffer = {}  # Format: {"YYYY-MM-DD HH:MM": [readings]}
        self.current_minute_key = None  # Track which minute we're currently buffering
        
        # Ensure required directories exist
        Path(self.minutes_dir).mkdir(exist_ok=True)
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
    
    def get_minute_file_path(self, date=None):
        """Get the file path for minute data for a given date (in configured timezone)"""
        if date is None:
            date = self.get_local_time().date()
        elif isinstance(date, datetime):
            date = date.date()
        
        return os.path.join(self.minutes_dir, f"owlet_minutes_{date.isoformat()}.json")
    
    def load_daily_minutes(self, date=None):
        """Load minute data for a specific day"""
        filepath = self.get_minute_file_path(date)
        if not os.path.exists(filepath):
            return []
        
        try:
            with open(filepath, 'r') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Failed to load daily minutes from {filepath}: {e}")
            return []
    
    def save_daily_minutes(self, minutes_data, date=None):
        """Save minute data for a specific day"""
        filepath = self.get_minute_file_path(date)
        try:
            with open(filepath, 'w') as f:
                json.dump(minutes_data, f, indent=2)
            return True
        except Exception as e:
            logger.error(f"Failed to save daily minutes to {filepath}: {e}")
            return False
    
    def calculate_minute_average(self, readings):
        """Calculate HR and O2 averages from a list of readings for a minute"""
        if not readings:
            return None
        
        # Filter out None values
        heart_rates = [r.get('heart_rate') for r in readings if r.get('heart_rate') is not None]
        oxygen_sats = [r.get('oxygen_saturation') for r in readings if r.get('oxygen_saturation') is not None]
        
        # Calculate averages
        avg_result = {
            'data_points': len(readings)
        }
        
        if heart_rates:
            avg_result['heart_rate_avg'] = round(sum(heart_rates) / len(heart_rates), 1)
        else:
            avg_result['heart_rate_avg'] = None
        
        if oxygen_sats:
            avg_result['oxygen_saturation_avg'] = round(sum(oxygen_sats) / len(oxygen_sats), 1)
        else:
            avg_result['oxygen_saturation_avg'] = None
        
        return avg_result
    
    def process_minute_buffer(self, vital):
        """
        Process readings in the minute buffer. When a new minute is detected,
        save the previous minute's average and clear the buffer.
        Returns True if a new minute's data was saved, False otherwise.
        """
        if not vital or 'timestamp' not in vital:
            return False
        
        # Get current time in local timezone
        vital_time = datetime.fromisoformat(vital['timestamp'].replace('Z', '+00:00'))
        vital_time_local = vital_time.astimezone(self.timezone)
        
        # Create minute key (YYYY-MM-DD HH:MM)
        minute_key = vital_time_local.strftime('%Y-%m-%d %H:%M')
        
        # Check if we've moved to a new minute
        if self.current_minute_key is not None and minute_key != self.current_minute_key:
            # New minute detected - process and save previous minute
            try:
                if self.current_minute_key in self.minute_buffer:
                    readings = self.minute_buffer[self.current_minute_key]
                    avg_data = self.calculate_minute_average(readings)
                    
                    if avg_data:
                        # Parse the minute key to get timestamp
                        minute_datetime = datetime.strptime(self.current_minute_key, '%Y-%m-%d %H:%M')
                        # Convert back to UTC for storage
                        minute_datetime_tz = self.timezone.localize(minute_datetime)
                        minute_datetime_utc = minute_datetime_tz.astimezone(timezone.utc)
                        
                        # Create minute entry
                        minute_entry = {
                            'timestamp': minute_datetime_utc.isoformat().replace('+00:00', 'Z'),
                            'heart_rate_avg': avg_data.get('heart_rate_avg'),
                            'oxygen_saturation_avg': avg_data.get('oxygen_saturation_avg'),
                            'data_points': avg_data.get('data_points')
                        }
                        
                        # Load today's minute data and append
                        minute_date = datetime.fromisoformat(self.current_minute_key.split(' ')[0]).date()
                        daily_minutes = self.load_daily_minutes(minute_date)
                        daily_minutes.append(minute_entry)
                        self.save_daily_minutes(daily_minutes, minute_date)
                        
                        # Clear the previous minute from buffer
                        del self.minute_buffer[self.current_minute_key]
                        return True
            except Exception as e:
                logger.error(f"Error processing minute buffer: {e}")
                import traceback
                logger.error(f"Full traceback: {traceback.format_exc()}")
        
        # Add current vital to buffer
        if minute_key not in self.minute_buffer:
            self.minute_buffer[minute_key] = []
        
        self.minute_buffer[minute_key].append(vital)
        self.current_minute_key = minute_key
        
        return False
        
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
    
    def save_latest(self, vital):
        """Save only the latest vital reading (real-time data)"""
        try:
            with open(self.latest_file, 'w') as f:
                json.dump(vital, f, indent=2)
        except Exception as e:
            logger.error(f"Failed to save latest vital: {e}")
    
    def get_daily_summary_filename(self, date=None):
        """Get the filename for a daily summary based on date (in the configured timezone)"""
        if date is None:
            date = self.get_local_time().date()
        elif isinstance(date, datetime):
            date = date.date()
        
        return os.path.join(self.daily_summaries_dir, f"owlet_summary_{date.isoformat()}.json")
    
    def aggregate_vitals_to_summary(self, date=None):
        """Aggregate minute-by-minute vital readings into a daily summary with hourly statistics"""
        if date is None:
            date = self.get_local_time().date()
        elif isinstance(date, datetime):
            date = date.date()
        
        # Load minute data for the day
        minutes = self.load_daily_minutes(date)
        
        if not minutes:
            return None
        
        try:
            # Organize minutes by hour (0-23)
            hourly_data_by_hour = {hour: [] for hour in range(24)}
            
            for minute in minutes:
                try:
                    minute_time = datetime.fromisoformat(minute['timestamp'].replace('Z', '+00:00'))
                    minute_time_local = minute_time.astimezone(self.timezone)
                    hour = minute_time_local.hour
                    hourly_data_by_hour[hour].append(minute)
                except Exception as e:
                    logger.warning(f"Could not parse minute timestamp: {minute.get('timestamp')}, {e}")
            
            # Helper function to aggregate minute data for a list of hours
            def aggregate_hour_data(minutes_list):
                """Aggregate minute data from a list of minute entries"""
                if not minutes_list:
                    return None
                
                heart_rates = [m.get('heart_rate_avg') for m in minutes_list if m.get('heart_rate_avg') is not None]
                oxygen_sats = [m.get('oxygen_saturation_avg') for m in minutes_list if m.get('oxygen_saturation_avg') is not None]
                
                return {
                    'data_points': sum(m.get('data_points', 0) for m in minutes_list),
                    'heart_rate': {
                        'avg': round(sum(heart_rates) / len(heart_rates), 1) if heart_rates else None,
                        'min': min(heart_rates) if heart_rates else None,
                        'max': max(heart_rates) if heart_rates else None,
                    },
                    'oxygen_saturation': {
                        'avg': round(sum(oxygen_sats) / len(oxygen_sats), 1) if oxygen_sats else None,
                        'min': min(oxygen_sats) if oxygen_sats else None,
                        'max': max(oxygen_sats) if oxygen_sats else None,
                    }
                }
            
            # Build hourly data array
            hourly_data = []
            for hour in range(24):
                if hourly_data_by_hour[hour]:
                    hour_agg = aggregate_hour_data(hourly_data_by_hour[hour])
                    hour_agg['hour'] = hour
                    hourly_data.append(hour_agg)
                else:
                    hourly_data.append({
                        'hour': hour,
                        'data_points': 0
                    })
            
            # Get daily aggregates for quick reference
            daily_agg = aggregate_hour_data(minutes)
            
            # Determine first and last timestamps
            first_timestamp = minutes[-1]['timestamp'] if minutes else None
            last_timestamp = minutes[0]['timestamp'] if minutes else None
            
            summary = {
                'date': date.isoformat(),  # YYYY-MM-DD in local timezone
                'total_data_points': sum(m.get('data_points', 0) for m in minutes),
                'first_timestamp': first_timestamp,
                'last_timestamp': last_timestamp,
                'daily': daily_agg,
                'hourly': hourly_data
            }
            
            return summary
        except Exception as e:
            logger.error(f"Failed to aggregate vitals to summary: {e}")
            import traceback
            logger.error(f"Full traceback: {traceback.format_exc()}")
            return None
    
    def save_daily_summary(self, summary, date=None):
        """Save a daily summary to file"""
        try:
            filename = self.get_daily_summary_filename(date)
            with open(filename, 'w') as f:
                json.dump(summary, f, indent=2)
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
        Gets the past hour of minute-by-minute data and creates an hourly average.
        Uses the configured timezone for hour calculations.
        """
        try:
            current_time = self.get_local_time()
            current_hour = current_time.hour
            
            # Load today's minute data
            today_minutes = self.load_daily_minutes(current_time.date())
            if not today_minutes:
                return
            
            # Calculate the time range for the past hour
            one_hour_ago = current_time - timedelta(hours=1)
            
            # Filter minute data for the past hour
            past_hour_minutes = []
            for minute in today_minutes:
                try:
                    minute_time = datetime.fromisoformat(minute['timestamp'].replace('Z', '+00:00'))
                    if minute_time >= one_hour_ago and minute_time <= current_time:
                        past_hour_minutes.append(minute)
                except Exception as e:
                    logger.warning(f"Could not parse minute timestamp for hourly update: {minute.get('timestamp')}, {e}")
            
            if not past_hour_minutes:
                return
            
            # Helper function to aggregate minute data for an hour
            def aggregate_hour_minutes(minutes_list):
                """Aggregate minute data from a list of minute entries"""
                if not minutes_list:
                    return None
                
                heart_rates = [m.get('heart_rate_avg') for m in minutes_list if m.get('heart_rate_avg') is not None]
                oxygen_sats = [m.get('oxygen_saturation_avg') for m in minutes_list if m.get('oxygen_saturation_avg') is not None]
                
                return {
                    'data_points': sum(m.get('data_points', 0) for m in minutes_list),
                    'heart_rate': {
                        'avg': round(sum(heart_rates) / len(heart_rates), 1) if heart_rates else None,
                        'min': min(heart_rates) if heart_rates else None,
                        'max': max(heart_rates) if heart_rates else None,
                    },
                    'oxygen_saturation': {
                        'avg': round(sum(oxygen_sats) / len(oxygen_sats), 1) if oxygen_sats else None,
                        'min': min(oxygen_sats) if oxygen_sats else None,
                        'max': max(oxygen_sats) if oxygen_sats else None,
                    }
                }
            
            # Create hourly entry for the past hour
            hour_agg = aggregate_hour_minutes(past_hour_minutes)
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
            else:
                todays_hourly['hourly'].append(hour_agg)
                # Sort by hour to keep it organized
                todays_hourly['hourly'].sort(key=lambda x: x.get('hour', 0))
            
            # Update metadata
            todays_hourly['last_update'] = current_time.isoformat().replace('+00:00', 'Z')
            todays_hourly['total_hours'] = len(todays_hourly.get('hourly', []))
            
            # Save the updated data
            self.save_todays_hourly(todays_hourly)
            
        except Exception as e:
            logger.error(f"Failed to update today's hourly data: {e}")
            import traceback
            logger.error(f"Full traceback: {traceback.format_exc()}")
    
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
        Check if yesterday's summary exists. If yes, keep it.
        If no, create yesterday's summary from minute data.
        Also check for any other dates with minute data but no summaries and generate them.
        """
        try:
            current_time = self.get_local_time()
            yesterday = (current_time - timedelta(days=1)).date()
            
            yesterday_summary_file = self.get_daily_summary_filename(yesterday)
            
            # Check if yesterday's summary already exists
            if not os.path.exists(yesterday_summary_file):
                # Load minute data for yesterday
                yesterday_minutes = self.load_daily_minutes(yesterday)
                
                if yesterday_minutes:
                    summary = self.aggregate_vitals_to_summary(yesterday)
                    if summary:
                        self.save_daily_summary(summary, yesterday)
                        logger.info(f"Generated summary for yesterday ({yesterday.isoformat()})")
            
            # Also check for any other dates with minute data but no summaries
            # This catches up on any missing summaries (e.g., if service was down)
            self.generate_missing_summaries()
            
        except Exception as e:
            logger.error(f"Error during daily cleanup: {e}")
            import traceback
            logger.error(f"Full traceback: {traceback.format_exc()}")
    
    def generate_missing_summaries(self, max_days=30):
        """
        Generate summaries for all dates that have minute data but no summary.
        This ensures we catch up on any missing summaries automatically.
        
        Args:
            max_days: Maximum number of days to check back (default: 30)
        """
        try:
            minutes_dir = Path(self.minutes_dir)
            summaries_dir = Path(self.daily_summaries_dir)
            
            if not minutes_dir.exists():
                return
            
            # Get all minute files
            minute_files = list(minutes_dir.glob('owlet_minutes_*.json'))
            
            if not minute_files:
                return
            
            generated_count = 0
            
            for minute_file in minute_files:
                # Extract date from filename (format: owlet_minutes_YYYY-MM-DD.json)
                try:
                    date_str = minute_file.stem.replace('owlet_minutes_', '')
                    date = datetime.strptime(date_str, '%Y-%m-%d').date()
                except ValueError:
                    logger.warning(f"Could not parse date from filename: {minute_file.name}")
                    continue
                
                # Skip if too old (optional limit)
                current_time = self.get_local_time()
                days_ago = (current_time.date() - date).days
                if days_ago > max_days:
                    continue
                
                # Check if summary already exists
                summary_file = summaries_dir / f"owlet_summary_{date.isoformat()}.json"
                if summary_file.exists():
                    continue
                
                # Generate summary
                summary = self.aggregate_vitals_to_summary(date)
                
                if summary:
                    if self.save_daily_summary(summary, date):
                        generated_count += 1
                        logger.info(f"Generated missing summary for {date.isoformat()}")
                    else:
                        logger.warning(f"Failed to save summary for {date.isoformat()}")
                else:
                    logger.debug(f"No data to generate summary for {date.isoformat()}")
            
            if generated_count > 0:
                logger.info(f"Generated {generated_count} missing summary file(s) during cleanup")
            
        except Exception as e:
            logger.error(f"Error generating missing summaries: {e}")
            import traceback
            logger.error(f"Full traceback: {traceback.format_exc()}")
    
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
            else:
                devices_list = devices
            
            if not devices_list or len(devices_list) == 0:
                logger.warning("No devices found")
                return None
            
            # Get first device (usually only one sock)
            try:
                # Extract device data
                if isinstance(devices_list[0], dict) and 'device' in devices_list[0]:
                    device_data = devices_list[0]['device']
                else:
                    device_data = devices_list[0]
                
                if not device_data:
                    logger.error(f"Invalid device data")
                    return None
                
                sock = Sock(self.api, device_data)
                await sock.update_properties()
                
                return sock
            except Exception as e:
                logger.error(f"Error processing device: {e}")
                import traceback
                logger.error(f"Full traceback: {traceback.format_exc()}")
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
            
            # Log the vital data we use from the API
            logger.info(f"Vital data - HR: {vital['heart_rate']}, O2: {vital['oxygen_saturation']}%, O2 Avg: {vital['oxygen_10_av']}%, Battery: {vital['battery_percentage']}%, Skin Temp: {vital['skin_temperature']}°C, Movement: {vital['movement']}, Signal: {vital['signal_strength']}, Sleep: {vital['sleep_state']}")
            
            return vital
        except Exception as e:
            logger.error(f"Failed to extract vital data: {e}")
            import traceback
            logger.error(f"Full traceback: {traceback.format_exc()}")
            return None
    
    def detect_sleep_state(self, sock):
        """Detect if baby is asleep based on Owlet data"""
        try:
            props = sock.properties if hasattr(sock, 'properties') else {}
            
            # Check Owlet's sleep_state: 0=unknown, 1=awake, 2=asleep
            sleep_state = props.get('sleep_state', 0)
            is_sleeping = sleep_state == 2  # 2 means asleep
            
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
            self.cleanup_yesterdays_data()
            self.last_daily_cleanup_time = datetime.now(timezone.utc)
        
        # Update today's hourly data if needed (every hour)
        if self.should_update_hourly():
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
            
            # Process vital through minute buffer - accumulates readings and saves minute averages
            self.process_minute_buffer(vital)
        
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
            except Exception as e:
                logger.warning(f"Error closing API session: {e}")
    
    async def run_service(self):
        """Run the service continuously"""
        # Support both minutes and seconds for flexibility
        if 'sync_interval_seconds' in self.config:
            sync_interval_seconds = self.config.get('sync_interval_seconds', 60)
        else:
            sync_interval = self.config.get('sync_interval_minutes', 1)
            sync_interval_seconds = sync_interval * 60
        
        try:
            while True:
                try:
                    # Wait for sync to complete before starting the next one
                    # This prevents stacking calls
                    await self.sync()
                except Exception as e:
                    logger.error(f"Unexpected error during sync: {e}")
                
                # Only sleep if sync_interval_seconds > 0
                if sync_interval_seconds > 0:
                    await asyncio.sleep(sync_interval_seconds)
        except KeyboardInterrupt:
            pass
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
        pass
    except Exception as e:
        logger.error(f"Fatal error: {e}")
        sys.exit(1)

