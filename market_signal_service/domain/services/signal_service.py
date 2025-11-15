from infrastructure.market_data.market_data_service import MarketDataService
from domain.engine.decision.decision_engine import DecisionEngine
from domain.models.signal_result import SignalResult
from infrastructure.logging.logger import get_logger

logger = get_logger(__name__)

class SignalService:
    def __init__(self):
        self.market_data_service = MarketDataService()
        self.decision_engine = DecisionEngine()
    
    async def get_market_signal(
        self, 
        symbol: str, 
        timeframe: str, 
        exchange: str = "binance",
        limit: int = 300
    ) -> SignalResult:
        logger.info(f"Getting signal for {symbol} on {exchange} ({timeframe})")
        
        ohlcv_data = await self.market_data_service.get_ohlcv(
            symbol=symbol,
            timeframe=timeframe,
            limit=limit,
            exchange=exchange
        )
        
        signal_result = self.decision_engine.analyze(
            ohlcv_data=ohlcv_data,
            symbol=symbol,
            timeframe=timeframe,
            exchange=exchange
        )
        
        logger.info(f"Signal generated: {signal_result.signal} (score: {signal_result.score})")
        
        return signal_result
