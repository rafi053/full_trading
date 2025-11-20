import pandas as pd
from market_signal_service.domain.engine.indicators.ma_indicator import MAIndicator
from market_signal_service.domain.engine.indicators.ema_indicator import EMAIndicator

class TrendDetector:
    @staticmethod
    def detect(data: pd.DataFrame) -> str:
        current_price = data['close'].iloc[-1]
        
        mas = MAIndicator.get_all_mas(data)
        emas = EMAIndicator.get_all_emas(data)
        
        ma50 = mas.get('ma50')
        ma200 = mas.get('ma200')
        ema20 = emas.get('ema20')
        
        if ma50 is None or ma200 is None:
            return "SIDEWAYS"
        
        bullish_signals = 0
        bearish_signals = 0
        
        if current_price > ma200:
            bullish_signals += 1
        else:
            bearish_signals += 1
        
        if current_price > ma50:
            bullish_signals += 1
        else:
            bearish_signals += 1
        
        if ma50 > ma200:
            bullish_signals += 1
        else:
            bearish_signals += 1
        
        if current_price > ema20:
            bullish_signals += 1
        else:
            bearish_signals += 1
        
        if bullish_signals >= 3:
            return "UPTREND"
        elif bearish_signals >= 3:
            return "DOWNTREND"
        else:
            return "SIDEWAYS"
    
    @staticmethod
    def get_trend_info(data: pd.DataFrame) -> dict:
        trend = TrendDetector.detect(data)
        
        current_price = data['close'].iloc[-1]
        mas = MAIndicator.get_all_mas(data)
        
        return {
            'trend': trend,
            'current_price': current_price,
            'ma50': mas.get('ma50'),
            'ma200': mas.get('ma200'),
            'price_vs_ma50': ((current_price / mas.get('ma50')) - 1) * 100 if mas.get('ma50') else None,
            'price_vs_ma200': ((current_price / mas.get('ma200')) - 1) * 100 if mas.get('ma200') else None
        }
