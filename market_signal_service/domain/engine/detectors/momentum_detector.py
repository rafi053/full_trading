import pandas as pd
from domain.engine.indicators.rsi_indicator import RSIIndicator
from domain.engine.indicators.macd_indicator import MACDIndicator
from domain.engine.indicators.stochastic_indicator import StochasticIndicator

class MomentumDetector:
    @staticmethod
    def detect(data: pd.DataFrame) -> str:
        rsi = RSIIndicator.get_current_rsi(data)
        macd = MACDIndicator.get_current_macd(data)
        stoch = StochasticIndicator.get_current_stoch(data)
        
        bullish_signals = 0
        bearish_signals = 0
        
        if rsi is not None:
            if rsi > 50:
                bullish_signals += 1
            elif rsi < 50:
                bearish_signals += 1
            
            if RSIIndicator.is_oversold(rsi):
                bullish_signals += 1
            elif RSIIndicator.is_overbought(rsi):
                bearish_signals += 1
        
        if macd['histogram'] > 0:
            bullish_signals += 1
        elif macd['histogram'] < 0:
            bearish_signals += 1
        
        if stoch['k'] is not None:
            if stoch['k'] > 50:
                bullish_signals += 1
            elif stoch['k'] < 50:
                bearish_signals += 1
        
        if bullish_signals > bearish_signals:
            return "BULLISH"
        elif bearish_signals > bullish_signals:
            return "BEARISH"
        else:
            return "NEUTRAL"
    
    @staticmethod
    def get_momentum_info(data: pd.DataFrame) -> dict:
        momentum = MomentumDetector.detect(data)
        
        rsi = RSIIndicator.get_current_rsi(data)
        macd = MACDIndicator.get_current_macd(data)
        stoch = StochasticIndicator.get_current_stoch(data)
        
        return {
            'momentum': momentum,
            'rsi': rsi,
            'macd': macd['macd'],
            'macd_signal': macd['signal'],
            'macd_histogram': macd['histogram'],
            'stoch_k': stoch['k'],
            'stoch_d': stoch['d']
        }
