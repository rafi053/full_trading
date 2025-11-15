import pandas as pd
from domain.engine.indicators.market_structure_indicator import MarketStructureIndicator

class StructureDetector:
    @staticmethod
    def detect(data: pd.DataFrame) -> str:
        return MarketStructureIndicator.detect_structure(data)
    
    @staticmethod
    def get_structure_info(data: pd.DataFrame) -> dict:
        structure = StructureDetector.detect(data)
        structure_details = MarketStructureIndicator.get_structure_info(data)
        
        return {
            'structure': structure,
            'swing_high_count': structure_details['swing_high_count'],
            'swing_low_count': structure_details['swing_low_count'],
            'last_swing_high': structure_details['last_swing_high'],
            'last_swing_low': structure_details['last_swing_low']
        }
