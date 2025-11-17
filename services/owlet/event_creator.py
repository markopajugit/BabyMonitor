# ============================================
# EVENT_CREATOR.PY - Sleep event detection
# ============================================

import logging
import requests
from datetime import datetime, timezone, timedelta

logger = logging.getLogger(__name__)

class EventCreator:
    """Create sleep events in Baby Monitor"""
    
    def __init__(self, config):
        self.config = config
        self.php_endpoint = config.get('php_api_endpoint', 'http://localhost/events.php')
    
    def should_create_sleep_event(self, event_type):
        """Check if we should create a sleep event (prevent duplicates)"""
        try:
            response = requests.get(self.php_endpoint)
            if response.status_code != 200:
                return True
            
            events = response.json()
            if not events:
                return True
            
            # Check if most recent event is same type (within 5 minutes)
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
        """Create an event in Baby Monitor"""
        try:
            now_utc = datetime.now(timezone.utc)
            event_id = int(now_utc.timestamp() * 1000)
            event_data = {
                'id': event_id,
                'type': event_type,
                'icon': icon,
                'time': now_utc.isoformat().replace('+00:00', 'Z'),
                'notes': notes
            }
            
            response = requests.post(self.php_endpoint, json=event_data)
            if response.status_code == 200:
                logger.info(f"Created event: {event_type}")
                return True
            else:
                logger.error(f"Failed to create event: {response.text}")
                return False
        except Exception as e:
            logger.error(f"Error creating event: {e}")
            return False

