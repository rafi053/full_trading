import pandas as pd
import numpy as np

class ADXIndicator:
    @staticmethod
    def calculate(data: pd.DataFrame, period: int = 14) -> dict:
        high = data['high']
        low = data['low']
        close = data['close']
        
        plus_dm = high.diff()
        minus_dm = -low.diff()
        
        plus_dm[plus_dm < 0] = 0
        minus_dm[minus_dm < 0] = 0
        
        tr1 = high - low
        tr2 = abs(high - close.shift())
        tr3 = abs(low - close.shift())
        tr = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1)
        
        atr = tr.rolling(window=period).mean()
        
        plus_di = 100 * (plus_dm.rolling(window=period).mean() / atr)
        minus_di = 100 * (minus_dm.rolling(window=period).mean() / atr)
        
        dx = 100 * abs(plus_di - minus_di) / (plus_di + minus_di)
        adx = dx.rolling(window=period).mean()
        
        return {
            'adx': adx,
            'plus_di': plus_di,
            'minus_di': minus_di
        }
    
    @staticmethod
    def get_current_adx(data: pd.DataFrame) -> dict:
        adx_data = ADXIndicator.calculate(data)
        return {
            'adx': adx_data['adx'].iloc[-1],
            'plus_di': adx_data['plus_di'].iloc[-1],
            'minus_di': adx_data['minus_di'].iloc[-1]
        }
    
    @staticmethod
    def get_trend_strength(adx_value: float) -> str:
        if adx_value is None or pd.isna(adx_value):
            return "NONE"
        if adx_value > 25:
            return "STRONG"
        elif adx_value > 20:
            return "MODERATE"
        else:
            return "WEAK"
