import pandas as pd
import numpy as np

class MAIndicator:
    @staticmethod
    def calculate(data: pd.DataFrame, period: int = 50) -> pd.Series:
        return data['close'].rolling(window=period).mean()
    
    @staticmethod
    def calculate_ma50(data: pd.DataFrame) -> pd.Series:
        return MAIndicator.calculate(data, 50)
    
    @staticmethod
    def calculate_ma200(data: pd.DataFrame) -> pd.Series:
        return MAIndicator.calculate(data, 200)
    
    @staticmethod
    def get_all_mas(data: pd.DataFrame) -> dict:
        return {
            'ma50': MAIndicator.calculate_ma50(data).iloc[-1] if len(data) >= 50 else None,
            'ma200': MAIndicator.calculate_ma200(data).iloc[-1] if len(data) >= 200 else None
        }
