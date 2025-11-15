import pandas as pd
import numpy as np

class EMAIndicator:
    @staticmethod
    def calculate(data: pd.DataFrame, period: int = 20) -> pd.Series:
        return data['close'].ewm(span=period, adjust=False).mean()
    
    @staticmethod
    def calculate_ema12(data: pd.DataFrame) -> pd.Series:
        return EMAIndicator.calculate(data, 12)
    
    @staticmethod
    def calculate_ema20(data: pd.DataFrame) -> pd.Series:
        return EMAIndicator.calculate(data, 20)
    
    @staticmethod
    def calculate_ema26(data: pd.DataFrame) -> pd.Series:
        return EMAIndicator.calculate(data, 26)
    
    @staticmethod
    def get_all_emas(data: pd.DataFrame) -> dict:
        return {
            'ema12': EMAIndicator.calculate_ema12(data).iloc[-1],
            'ema20': EMAIndicator.calculate_ema20(data).iloc[-1],
            'ema26': EMAIndicator.calculate_ema26(data).iloc[-1]
        }
