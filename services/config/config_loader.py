# ============================================
# CONFIG_LOADER.PY - Configuration management
# ============================================

import json
import os
import logging
import pytz
from datetime import timezone

logger = logging.getLogger(__name__)

class ConfigLoader:
    """Load and manage application configuration"""
    
    def __init__(self, config_file='owlet_config.json'):
        self.config_file = config_file
        self.config = self._load_config()
        self.timezone = self._get_timezone()
    
    def _load_config(self):
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
    
    def _get_timezone(self):
        """Get timezone from config or default to UTC"""
        if not self.config:
            return pytz.UTC
        
        timezone_str = self.config.get('timezone', 'UTC')
        try:
            return pytz.timezone(timezone_str)
        except Exception as e:
            logger.warning(f"Invalid timezone '{timezone_str}', defaulting to UTC: {e}")
            return pytz.UTC
    
    def get(self, key, default=None):
        """Get config value by key"""
        if not self.config:
            return default
        return self.config.get(key, default)
    
    def validate(self):
        """Validate required configuration"""
        if not self.config:
            return False, "Config file not loaded"
        
        required_fields = ['email', 'password', 'region']
        for field in required_fields:
            if field not in self.config:
                return False, f"Missing required field: {field}"
        
        return True, "Config valid"

