import pandas as pd
from domain.engine.indicators.adx_indicator import ADXIndicator

class StrengthDetector:
    @staticmethod
    def detect(data: pd.DataFrame) -> str:
        adx_data = ADXIndicator.get_current_adx(data)
        adx_value = adx_data['adx']
        
        return ADXIndicator.get_trend_strength(adx_value)
    
    @staticmethod
    def get_strength_info(data: pd.DataFrame) -> dict:
        strength = StrengthDetector.detect(data)
        adx_data = ADXIndicator.get_current_adx(data)
        
        return {
            'strength': strength,
            'adx': adx_data['adx'],
            'plus_di': adx_data['plus_di'],
            'minus_di': adx_data['minus_di'],
            'di_diff': adx_data['plus_di'] - adx_data['minus_di'] if adx_data['plus_di'] and adx_data['minus_di'] else None
        }
