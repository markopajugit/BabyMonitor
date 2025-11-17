#!/usr/bin/env python3
# ============================================
# OWLET_SYNC.PY - Service entry point
# ============================================

import asyncio
import logging
import sys

from services.owlet.sync_service import OwletSyncService

# Setup logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('owlet_sync.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

async def main():
    """Main entry point"""
    try:
        service = OwletSyncService()
        
        is_valid, msg = service.config_loader.validate()
        if not is_valid:
            logger.error(f"Configuration error: {msg}")
            return False
        
        logger.info("Configuration valid, starting service...")
        await service.run_service()
        return True
    except Exception as e:
        logger.error(f"Fatal error: {e}")
        return False

if __name__ == '__main__':
    try:
        success = asyncio.run(main())
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        logger.info("Service stopped by user")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Fatal error: {e}")
        sys.exit(1)
