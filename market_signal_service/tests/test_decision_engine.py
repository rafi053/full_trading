import pytest
import pandas as pd
import numpy as np
from market_signal_service.domain.engine.decision.decision_engine import DecisionEngine

@pytest.fixture
def sample_data():
    dates = pd.date_range(start='2024-01-01', periods=300, freq='1h')
    data = pd.DataFrame({
        'timestamp': dates,
        'open': np.linspace(40000, 50000, 300),
        'high': np.linspace(40500, 50500, 300),
        'low': np.linspace(39500, 49500, 300),
        'close': np.linspace(40000, 50000, 300),
        'volume': np.random.uniform(100, 1000, 300)
    })
    return data

def test_decision_engine_analyze(sample_data):
    engine = DecisionEngine()
    result = engine.analyze(sample_data, "BTCUSDT", "1h", "binance")
    
    assert result is not None
    assert result.signal in ["BUY", "SELL", "HOLD"]
    assert -1.0 <= result.score <= 1.0
    assert 0 <= result.strength_percent <= 100
    assert result.trend in ["UPTREND", "DOWNTREND", "SIDEWAYS"]
    assert result.momentum in ["BULLISH", "BEARISH", "NEUTRAL"]
    assert result.strength in ["STRONG", "MODERATE", "WEAK", "NONE"]
    assert result.structure in ["BULLISH_STRUCTURE", "BEARISH_STRUCTURE", "CHOPPY"]

def test_decision_engine_buy_signal(sample_data):
    engine = DecisionEngine()
    result = engine.analyze(sample_data, "BTCUSDT", "1h", "binance")
    
    if result.signal == "BUY":
        assert result.score > 0

def test_decision_engine_sell_signal():
    dates = pd.date_range(start='2024-01-01', periods=300, freq='1h')
    data = pd.DataFrame({
        'timestamp': dates,
        'open': np.linspace(50000, 40000, 300),
        'high': np.linspace(50500, 40500, 300),
        'low': np.linspace(49500, 39500, 300),
        'close': np.linspace(50000, 40000, 300),
        'volume': np.random.uniform(100, 1000, 300)
    })
    
    engine = DecisionEngine()
    result = engine.analyze(data, "BTCUSDT", "1h", "binance")
    
    if result.signal == "SELL":
        assert result.score < 0
