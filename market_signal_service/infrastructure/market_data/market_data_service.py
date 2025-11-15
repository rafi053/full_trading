import pandas as pd
from market_signal_service.infrastructure.market_data.binance_client import BinanceClient
from market_signal_service.infrastructure.market_data.bybit_client import BybitClient
from market_signal_service.infrastructure.market_data.kucoin_client import KuCoinClient
from market_signal_service.infrastructure.cache.cache_service import CacheService
from market_signal_service.core.exceptions import InvalidSymbolError
from market_signal_service.core.timeframes import normalize_timeframe
from market_signal_service.infrastructure.logging.logger import get_logger

logger = get_logger(__name__)

class MarketDataService:
    def __init__(self):
        self.binance_client = BinanceClient()
        self.bybit_client = BybitClient()
        self.kucoin_client = KuCoinClient()
        self.cache_service = CacheService()
    
    async def get_ohlcv(
        self, 
        symbol: str, 
        timeframe: str, 
        limit: int = 300, 
        exchange: str = "binance"
    ) -> pd.DataFrame:
        if not symbol or len(symbol.strip()) == 0:
            raise InvalidSymbolError("Symbol cannot be empty")
        
        symbol = symbol.upper().strip()
        exchange = exchange.lower()
        timeframe = normalize_timeframe(timeframe)
        
        cache_key = f"{exchange}:{symbol}:{timeframe}"
        cached_data = self.cache_service.get(cache_key)
        
        if cached_data is not None:
            logger.info(f"Cache hit for {cache_key}")
            return cached_data
        
        logger.info(f"Cache miss for {cache_key}, fetching from exchange")
        
        if exchange == "binance":
            data = self.binance_client.get_klines(symbol, timeframe, limit)
        elif exchange == "bybit":
            data = self.bybit_client.get_klines(symbol, timeframe, limit)
        elif exchange == "kucoin":
            data = self.kucoin_client.get_klines(symbol, timeframe, limit)
        else:
            raise InvalidSymbolError(f"Unsupported exchange: {exchange}")
        
        self.cache_service.set(cache_key, data, ttl=60)
        
        return data
