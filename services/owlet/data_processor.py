# ============================================
# DATA_PROCESSOR.PY - Vital data extraction and aggregation
# ============================================

import logging
from datetime import datetime, timezone, timedelta

logger = logging.getLogger(__name__)

class VitalDataProcessor:
    """Process and aggregate vital data"""
    
    def __init__(self, timezone_obj):
        self.timezone = timezone_obj
    
    def extract_vital_data(self, sock):
        """Extract vital signs from sock data"""
        try:
            props = sock.properties if hasattr(sock, 'properties') else {}
            
            vital = {
                'timestamp': datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z'),
                'heart_rate': props.get('heart_rate'),
                'oxygen_saturation': props.get('oxygen_saturation'),
                'oxygen_10_av': props.get('oxygen_10_av'),
                'movement': props.get('movement'),
                'battery_percentage': props.get('battery_percentage'),
                'battery_minutes': props.get('battery_minutes'),
                'signal_strength': props.get('signal_strength'),
                'skin_temperature': props.get('skin_temperature'),
                'sleep_state': props.get('sleep_state'),
                'sock_connected': not props.get('sock_disconnected', False),
                'sock_on': not props.get('sock_off', False),
                'low_battery': props.get('low_battery_alert'),
                'high_heart_rate': props.get('high_heart_rate_alert'),
                'low_oxygen': props.get('low_oxygen_alert'),
            }
            
            logger.info(f"Extracted vitals: HR={vital['heart_rate']}, O2={vital['oxygen_saturation']}%")
            return vital
        except Exception as e:
            logger.error(f"Failed to extract vital data: {e}")
            return None
    
    def detect_sleep_state(self, sock, recent_vitals=None):
        """Detect if baby is asleep"""
        try:
            props = sock.properties if hasattr(sock, 'properties') else {}
            sleep_state = props.get('sleep_state', 0)
            return sleep_state == 2  # 2 means asleep
        except Exception as e:
            logger.error(f"Failed to detect sleep state: {e}")
            return None
    
    def aggregate_vitals_to_summary(self, vitals):
        """Aggregate minute-by-minute vitals to daily summary"""
        if not vitals:
            return None
        
        try:
            # Organize vitals by hour
            hourly_vitals = {hour: [] for hour in range(24)}
            
            for vital in vitals:
                try:
                    vital_time = datetime.fromisoformat(vital['timestamp'].replace('Z', '+00:00'))
                    vital_time_local = vital_time.astimezone(self.timezone)
                    hour = vital_time_local.hour
                    hourly_vitals[hour].append(vital)
                except Exception as e:
                    logger.warning(f"Could not parse vital timestamp: {e}")
            
            # Aggregate hourly data
            hourly_data = []
            for hour in range(24):
                if hourly_vitals[hour]:
                    agg = self._aggregate_metrics(hourly_vitals[hour])
                    agg['hour'] = hour
                    hourly_data.append(agg)
                else:
                    hourly_data.append({'hour': hour, 'data_points': 0})
            
            # Build summary
            daily_agg = self._aggregate_metrics(vitals)
            
            try:
                first_vital_time = datetime.fromisoformat(vitals[0]['timestamp'].replace('Z', '+00:00'))
                first_vital_local = first_vital_time.astimezone(self.timezone)
                summary_date = first_vital_local.strftime('%Y-%m-%d')
            except:
                summary_date = vitals[0]['timestamp'][:10]
            
            summary = {
                'date': summary_date,
                'total_data_points': len(vitals),
                'first_timestamp': vitals[-1]['timestamp'],
                'last_timestamp': vitals[0]['timestamp'],
                'daily': daily_agg,
                'hourly': hourly_data
            }
            
            return summary
        except Exception as e:
            logger.error(f"Failed to aggregate vitals: {e}")
            return None
    
    def _aggregate_metrics(self, vitals_list):
        """Aggregate metrics from vitals list"""
        if not vitals_list:
            return None
        
        heart_rates = [v.get('heart_rate') for v in vitals_list if v.get('heart_rate') is not None]
        oxygen_sats = [v.get('oxygen_saturation') for v in vitals_list if v.get('oxygen_saturation') is not None]
        temperatures = [v.get('skin_temperature') for v in vitals_list if v.get('skin_temperature') is not None]
        
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
            'skin_temperature': {
                'avg': round(sum(temperatures) / len(temperatures), 2) if temperatures else None,
                'min': round(min(temperatures), 2) if temperatures else None,
                'max': round(max(temperatures), 2) if temperatures else None,
            }
        }

