import pandas as pd
import numpy as np

class MarketStructureIndicator:
    @staticmethod
    def find_swing_points(data: pd.DataFrame, lookback: int = 5) -> dict:
        highs = data['high']
        lows = data['low']
        
        swing_highs = []
        swing_lows = []
        
        for i in range(lookback, len(data) - lookback):
            is_swing_high = all(highs.iloc[i] > highs.iloc[i-j] for j in range(1, lookback+1)) and \
                           all(highs.iloc[i] > highs.iloc[i+j] for j in range(1, lookback+1))
            
            is_swing_low = all(lows.iloc[i] < lows.iloc[i-j] for j in range(1, lookback+1)) and \
                          all(lows.iloc[i] < lows.iloc[i+j] for j in range(1, lookback+1))
            
            if is_swing_high:
                swing_highs.append({'index': i, 'value': highs.iloc[i]})
            if is_swing_low:
                swing_lows.append({'index': i, 'value': lows.iloc[i]})
        
        return {
            'swing_highs': swing_highs,
            'swing_lows': swing_lows
        }
    
    @staticmethod
    def detect_structure(data: pd.DataFrame) -> str:
        swing_points = MarketStructureIndicator.find_swing_points(data)
        
        highs = swing_points['swing_highs']
        lows = swing_points['swing_lows']
        
        if len(highs) < 2 or len(lows) < 2:
            return "CHOPPY"
        
        higher_highs = highs[-1]['value'] > highs[-2]['value']
        higher_lows = lows[-1]['value'] > lows[-2]['value']
        lower_highs = highs[-1]['value'] < highs[-2]['value']
        lower_lows = lows[-1]['value'] < lows[-2]['value']
        
        if higher_highs and higher_lows:
            return "BULLISH_STRUCTURE"
        elif lower_highs and lower_lows:
            return "BEARISH_STRUCTURE"
        else:
            return "CHOPPY"
    
    @staticmethod
    def get_structure_info(data: pd.DataFrame) -> dict:
        structure = MarketStructureIndicator.detect_structure(data)
        swing_points = MarketStructureIndicator.find_swing_points(data)
        
        return {
            'structure': structure,
            'swing_high_count': len(swing_points['swing_highs']),
            'swing_low_count': len(swing_points['swing_lows']),
            'last_swing_high': swing_points['swing_highs'][-1] if swing_points['swing_highs'] else None,
            'last_swing_low': swing_points['swing_lows'][-1] if swing_points['swing_lows'] else None
        }
