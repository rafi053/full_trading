import pandas as pd
import numpy as np

class RSIIndicator:
    @staticmethod
    def calculate(data: pd.DataFrame, period: int = 14) -> pd.Series:
        delta = data['close'].diff()
        
        gain = delta.where(delta > 0, 0)
        loss = -delta.where(delta < 0, 0)
        
        avg_gain = gain.rolling(window=period).mean()
        avg_loss = loss.rolling(window=period).mean()
        
        rs = avg_gain / avg_loss
        rsi = 100 - (100 / (1 + rs))
        
        return rsi
    
    @staticmethod
    def get_current_rsi(data: pd.DataFrame, period: int = 14) -> float:
        rsi = RSIIndicator.calculate(data, period)
        return rsi.iloc[-1] if len(rsi) > 0 else None
    
    @staticmethod
    def is_overbought(rsi_value: float, threshold: float = 70) -> bool:
        return rsi_value > threshold if rsi_value is not None else False
    
    @staticmethod
    def is_oversold(rsi_value: float, threshold: float = 30) -> bool:
        return rsi_value < threshold if rsi_value is not None else False
