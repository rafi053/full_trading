from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class SignalDetails(BaseModel):
    trend: str
    momentum: str
    strength: str
    structure: str
    indicators: Optional[Dict[str, Any]] = None

class SignalResponse(BaseModel):
    signal: str
    score: float
    strength_percent: int
    details: SignalDetails
    symbol: str
    timeframe: str
    exchange: str
    timestamp: datetime
    
    @classmethod
    def from_signal_result(cls, result):
        return cls(
            signal=result.signal,
            score=result.score,
            strength_percent=result.strength_percent,
            details=SignalDetails(
                trend=result.trend,
                momentum=result.momentum,
                strength=result.strength,
                structure=result.structure,
                indicators=result.indicators
            ),
            symbol=result.symbol,
            timeframe=result.timeframe,
            exchange=result.exchange,
            timestamp=result.timestamp
        )
