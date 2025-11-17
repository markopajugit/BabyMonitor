# ============================================
# FILE_MANAGER.PY - File I/O operations
# ============================================

import json
import os
import logging
from pathlib import Path
from datetime import datetime, timedelta, timezone

logger = logging.getLogger(__name__)

class OwletFileManager:
    """Manage all file I/O operations for Owlet data"""
    
    def __init__(self, timezone):
        self.timezone = timezone
        self.vitals_file = 'owlet_vitals.json'
        self.latest_file = 'owlet_latest.json'
        self.history_file = 'owlet_history.json'
        self.daily_summaries_dir = 'owlet_daily_summaries'
        self.todays_hourly_file = 'owlet_todays_hourly.json'
        
        # Ensure directories exist
        Path(self.daily_summaries_dir).mkdir(exist_ok=True)
    
    def read_json(self, filepath):
        """Read JSON file"""
        if not os.path.exists(filepath):
            return None
        
        try:
            with open(filepath, 'r') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Failed to read {filepath}: {e}")
            return None
    
    def write_json(self, filepath, data):
        """Write JSON file"""
        try:
            with open(filepath, 'w') as f:
                json.dump(data, f, indent=2)
            return True
        except Exception as e:
            logger.error(f"Failed to write {filepath}: {e}")
            return False
    
    def load_vitals(self):
        """Load vital signs"""
        data = self.read_json(self.vitals_file)
        return data if data else []
    
    def save_vitals(self, vitals):
        """Save vital signs"""
        if self.write_json(self.vitals_file, vitals):
            logger.info(f"Saved {len(vitals)} vital readings")
            return True
        return False
    
    def load_latest(self):
        """Load latest vital reading"""
        return self.read_json(self.latest_file)
    
    def save_latest(self, vital):
        """Save latest vital reading"""
        if self.write_json(self.latest_file, vital):
            logger.info(f"Saved latest vital: HR={vital.get('heart_rate')}, O2={vital.get('oxygen_saturation')}%")
            return True
        return False
    
    def load_history(self):
        """Load historical vital data"""
        data = self.read_json(self.history_file)
        return data if data else []
    
    def save_history(self, history):
        """Save historical vital data"""
        if self.write_json(self.history_file, history):
            logger.info(f"Saved {len(history)} historical readings")
            return True
        return False
    
    def get_daily_summary_filename(self, date=None):
        """Get filename for daily summary"""
        if date is None:
            date = datetime.now(timezone.utc).astimezone(self.timezone).date()
        elif isinstance(date, datetime):
            date = date.date()
        
        return os.path.join(self.daily_summaries_dir, f"owlet_summary_{date.isoformat()}.json")
    
    def load_daily_summary(self, date=None):
        """Load daily summary"""
        filename = self.get_daily_summary_filename(date)
        return self.read_json(filename)
    
    def save_daily_summary(self, summary, date=None):
        """Save daily summary"""
        filename = self.get_daily_summary_filename(date)
        if self.write_json(filename, summary):
            logger.info(f"Saved daily summary: {filename}")
            return True
        return False
    
    def load_todays_hourly(self):
        """Load today's hourly data"""
        data = self.read_json(self.todays_hourly_file)
        return data if data else {'date': self.get_local_date(), 'hourly': []}
    
    def save_todays_hourly(self, data):
        """Save today's hourly data"""
        if self.write_json(self.todays_hourly_file, data):
            logger.info(f"Saved today's hourly data: {len(data.get('hourly', []))} hours")
            return True
        return False
    
    def cleanup_old_vitals(self, vitals, retention_hours=48):
        """Remove vitals older than retention period"""
        cutoff_time = datetime.now(timezone.utc) - timedelta(hours=retention_hours)
        
        filtered = []
        for vital in vitals:
            try:
                vital_time = datetime.fromisoformat(vital['timestamp'].replace('Z', '+00:00'))
                if vital_time > cutoff_time:
                    filtered.append(vital)
            except Exception as e:
                logger.warning(f"Could not parse vital timestamp: {e}")
                filtered.append(vital)
        
        if len(filtered) < len(vitals):
            logger.info(f"Cleaned up {len(vitals) - len(filtered)} old vitals")
        
        return filtered
    
    def get_local_date(self):
        """Get current date in local timezone"""
        return datetime.now(timezone.utc).astimezone(self.timezone).strftime('%Y-%m-%d')

