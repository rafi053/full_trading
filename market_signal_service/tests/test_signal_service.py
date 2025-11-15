import pytest
from unittest.mock import Mock, patch
import pandas as pd
import numpy as np
from domain.services.signal_service import SignalService

@pytest.fixture
def mock_market_data():
    dates = pd.date_range(start='2024-01-01', periods=300, freq='1h')
    return pd.DataFrame({
        'timestamp': dates,
        'open': np.linspace(40000, 50000, 300),
        'high': np.linspace(40500, 50500, 300),
        'low': np.linspace(39500, 49500, 300),
        'close': np.linspace(40000, 50000, 300),
        'volume': np.random.uniform(100, 1000, 300)
    })

@pytest.mark.asyncio
async def test_signal_service_get_market_signal(mock_market_data):
    service = SignalService()
    
    with patch.object(service.market_data_service, 'get_ohlcv', return_value=mock_market_data):
        result = await service.get_market_signal("BTCUSDT", "1h", "binance")
        
        assert result is not None
        assert result.signal in ["BUY", "SELL", "HOLD"]
        assert result.symbol == "BTCUSDT"
        assert result.timeframe == "1h"
        assert result.exchange == "binance"

@pytest.mark.asyncio
async def test_signal_service_different_exchanges(mock_market_data):
    service = SignalService()
    
    exchanges = ["binance", "bybit", "kucoin"]
    
    for exchange in exchanges:
        with patch.object(service.market_data_service, 'get_ohlcv', return_value=mock_market_data):
            result = await service.get_market_signal("BTCUSDT", "1h", exchange)
            assert result.exchange == exchange
