# ============================================
# API_CLIENT.PY - Owlet API communication
# ============================================

import logging

logger = logging.getLogger(__name__)

try:
    from pyowletapi.api import OwletAPI
    from pyowletapi.sock import Sock
except ImportError:
    logger.error("pyowletapi not installed. Run: pip install pyowletapi")
    OwletAPI = None
    Sock = None

class OwletAPIClient:
    """Handle Owlet API authentication and communication"""
    
    def __init__(self, config):
        self.config = config
        self.api = None
    
    async def authenticate(self):
        """Authenticate with Owlet API"""
        if self.api is not None:
            return True
        
        if not OwletAPI:
            logger.error("pyowletapi not available")
            return False
        
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
            self.api = None
            return False
    
    async def fetch_device_data(self):
        """Fetch device data from Owlet"""
        if not self.api:
            logger.error("API not authenticated")
            return None
        
        try:
            devices = await self.api.get_devices()
            
            # Handle response wrapper
            if isinstance(devices, dict) and 'response' in devices:
                devices_list = devices['response']
            else:
                devices_list = devices
            
            if not devices_list or len(devices_list) == 0:
                logger.warning("No devices found")
                return None
            
            # Get first device
            if isinstance(devices_list[0], dict) and 'device' in devices_list[0]:
                device_data = devices_list[0]['device']
            else:
                device_data = devices_list[0]
            
            if not device_data:
                logger.error("Invalid device data")
                return None
            
            logger.info(f"Creating Sock object for device: {device_data.get('dsn', 'unknown')}")
            sock = Sock(self.api, device_data)
            await sock.update_properties()
            
            logger.info(f"Successfully fetched device data")
            return sock
        except Exception as e:
            logger.error(f"Failed to fetch device data: {e}")
            self.api = None
            return None
    
    async def close(self):
        """Close API session"""
        if self.api:
            try:
                if hasattr(self.api, 'session') and self.api.session:
                    await self.api.session.close()
                self.api = None
                logger.info("API session closed")
            except Exception as e:
                logger.warning(f"Error closing API session: {e}")

