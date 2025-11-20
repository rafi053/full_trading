from pydantic import BaseModel, validator
from typing import Optional
from market_signal_service.core.timeframes import VALID_TIMEFRAMES
class SignalRequest(BaseModel):
    symbol: str
    timeframe: str = "1h"
    exchange: str = "binance"
    limit: Optional[int] = 300
    
    @validator('symbol')
    def validate_symbol(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError("Symbol cannot be empty")
        return v.upper().strip()
    
    @validator('timeframe')
    def validate_timeframe(cls, v):
        if v not in VALID_TIMEFRAMES:
            raise ValueError(f"Invalid timeframe. Must be one of: {VALID_TIMEFRAMES}")
        return v
    
    @validator('exchange')
    def validate_exchange(cls, v):
        valid_exchanges = ["binance", "bybit", "kucoin"]
        if v.lower() not in valid_exchanges:
            raise ValueError(f"Invalid exchange. Must be one of: {valid_exchanges}")
        return v.lower()
    
    @validator('limit')
    def validate_limit(cls, v):
        if v is not None and (v < 50 or v > 1000):
            raise ValueError("Limit must be between 50 and 1000")
        return v
