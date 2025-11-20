import pandas as pd
import numpy as np
from market_signal_service.domain.engine.indicators.ema_indicator import EMAIndicator

class MACDIndicator:
    @staticmethod
    def calculate(data: pd.DataFrame, fast: int = 12, slow: int = 26, signal: int = 9) -> dict:
        ema_fast = EMAIndicator.calculate(data, fast)
        ema_slow = EMAIndicator.calculate(data, slow)
        
        macd_line = ema_fast - ema_slow
        signal_line = macd_line.ewm(span=signal, adjust=False).mean()
        histogram = macd_line - signal_line
        
        return {
            'macd': macd_line,
            'signal': signal_line,
            'histogram': histogram
        }
    
    @staticmethod
    def get_current_macd(data: pd.DataFrame) -> dict:
        macd_data = MACDIndicator.calculate(data)
        return {
            'macd': macd_data['macd'].iloc[-1],
            'signal': macd_data['signal'].iloc[-1],
            'histogram': macd_data['histogram'].iloc[-1]
        }
    
    @staticmethod
    def is_bullish_crossover(macd_data: dict) -> bool:
        if len(macd_data['macd']) < 2:
            return False
        return (macd_data['macd'].iloc[-1] > macd_data['signal'].iloc[-1] and 
                macd_data['macd'].iloc[-2] <= macd_data['signal'].iloc[-2])
    
    @staticmethod
    def is_bearish_crossover(macd_data: dict) -> bool:
        if len(macd_data['macd']) < 2:
            return False
        return (macd_data['macd'].iloc[-1] < macd_data['signal'].iloc[-1] and 
                macd_data['macd'].iloc[-2] >= macd_data['signal'].iloc[-2])
