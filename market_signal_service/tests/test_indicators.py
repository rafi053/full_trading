import pytest
import pandas as pd
import numpy as np
from market_signal_service.domain.engine.indicators.ma_indicator import MAIndicator
from market_signal_service.domain.engine.indicators.ema_indicator import EMAIndicator
from market_signal_service.domain.engine.indicators.rsi_indicator import RSIIndicator
from market_signal_service.domain.engine.indicators.macd_indicator import MACDIndicator
from market_signal_service.domain.engine.indicators.stochastic_indicator import StochasticIndicator
from market_signal_service.domain.engine.indicators.adx_indicator import ADXIndicator

@pytest.fixture
def sample_data():
    dates = pd.date_range(start='2024-01-01', periods=300, freq='1h')
    data = pd.DataFrame({
        'timestamp': dates,
        'open': np.random.uniform(40000, 50000, 300),
        'high': np.random.uniform(50000, 52000, 300),
        'low': np.random.uniform(38000, 40000, 300),
        'close': np.random.uniform(40000, 50000, 300),
        'volume': np.random.uniform(100, 1000, 300)
    })
    return data

def test_ma_indicator(sample_data):
    ma50 = MAIndicator.calculate_ma50(sample_data)
    assert len(ma50) == len(sample_data)
    assert not ma50.iloc[-1] is None

def test_ema_indicator(sample_data):
    emas = EMAIndicator.get_all_emas(sample_data)
    assert 'ema12' in emas
    assert 'ema20' in emas
    assert 'ema26' in emas

def test_rsi_indicator(sample_data):
    rsi = RSIIndicator.get_current_rsi(sample_data)
    assert rsi is not None
    assert 0 <= rsi <= 100

def test_macd_indicator(sample_data):
    macd = MACDIndicator.get_current_macd(sample_data)
    assert 'macd' in macd
    assert 'signal' in macd
    assert 'histogram' in macd

def test_stochastic_indicator(sample_data):
    stoch = StochasticIndicator.get_current_stoch(sample_data)
    assert 'k' in stoch
    assert 'd' in stoch

def test_adx_indicator(sample_data):
    adx = ADXIndicator.get_current_adx(sample_data)
    assert 'adx' in adx
    assert 'plus_di' in adx
    assert 'minus_di' in adx
