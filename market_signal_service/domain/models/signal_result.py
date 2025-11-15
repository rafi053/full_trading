from dataclasses import dataclass
from datetime import datetime
from typing import Optional, Dict, Any

@dataclass
class SignalResult:
    signal: str
    score: float
    strength_percent: int
    trend: str
    momentum: str
    strength: str
    structure: str
    symbol: str
    timeframe: str
    exchange: str
    timestamp: datetime
    indicators: Optional[Dict[str, Any]] = None
    
    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = datetime.utcnow()
