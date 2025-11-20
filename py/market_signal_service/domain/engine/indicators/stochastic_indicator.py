import pandas as pd
import numpy as np

class StochasticIndicator:
    @staticmethod
    def calculate(data: pd.DataFrame, k_period: int = 14, d_period: int = 3) -> dict:
        low_min = data['low'].rolling(window=k_period).min()
        high_max = data['high'].rolling(window=k_period).max()
        
        k_percent = 100 * ((data['close'] - low_min) / (high_max - low_min))
        d_percent = k_percent.rolling(window=d_period).mean()
        
        return {
            'k': k_percent,
            'd': d_percent
        }
    
    @staticmethod
    def get_current_stoch(data: pd.DataFrame) -> dict:
        stoch_data = StochasticIndicator.calculate(data)
        return {
            'k': stoch_data['k'].iloc[-1],
            'd': stoch_data['d'].iloc[-1]
        }
    
    @staticmethod
    def is_overbought(k_value: float, threshold: float = 80) -> bool:
        return k_value > threshold if k_value is not None else False
    
    @staticmethod
    def is_oversold(k_value: float, threshold: float = 20) -> bool:
        return k_value < threshold if k_value is not None else False
