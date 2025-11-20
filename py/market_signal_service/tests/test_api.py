import pytest
from fastapi.testclient import TestClient
from unittest.mock import Mock, patch
import pandas as pd
import numpy as np
from app import app

client = TestClient(app)

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

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_get_signal_endpoint(mock_market_data):
    with patch('infrastructure.market_data.market_data_service.MarketDataService.get_ohlcv') as mock_get_ohlcv:
        mock_get_ohlcv.return_value = mock_market_data
        
        response = client.get("/signal?symbol=BTCUSDT&timeframe=1h&exchange=binance")
        
        assert response.status_code == 200
        data = response.json()
        assert "signal" in data
        assert "score" in data
        assert "strength_percent" in data
        assert data["signal"] in ["BUY", "SELL", "HOLD"]

def test_get_signal_invalid_symbol():
    response = client.get("/signal?symbol=&timeframe=1h&exchange=binance")
    assert response.status_code == 400

def test_get_signal_invalid_timeframe():
    response = client.get("/signal?symbol=BTCUSDT&timeframe=invalid&exchange=binance")
    assert response.status_code == 400

def test_post_signal_endpoint(mock_market_data):
    with patch('infrastructure.market_data.market_data_service.MarketDataService.get_ohlcv') as mock_get_ohlcv:
        mock_get_ohlcv.return_value = mock_market_data
        
        response = client.post("/signal", json={
            "symbol": "BTCUSDT",
            "timeframe": "1h",
            "exchange": "binance"
        })
        
        assert response.status_code == 200
        data = response.json()
        assert "signal" in data
