import requests
import pandas as pd
from typing import List
from market_signal_service.core.exceptions import ExchangeError, NoDataError
from market_signal_service.infrastructure.logging.logger import get_logger
logger = get_logger(__name__)

class BinanceClient:
    BASE_URL = "https://api.binance.com/api/v3"
    
    def __init__(self):
        self.session = requests.Session()
    
    def get_klines(self, symbol: str, interval: str, limit: int = 300) -> pd.DataFrame:
        try:
            url = f"{self.BASE_URL}/klines"
            params = {
                'symbol': symbol,
                'interval': interval,
                'limit': limit
            }
            
            logger.debug(f"Fetching klines from Binance: {symbol} {interval}")
            
            response = self.session.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            if not data or len(data) == 0:
                raise NoDataError(f"No data returned from Binance for {symbol}")
            
            df = pd.DataFrame(data, columns=[
                'timestamp', 'open', 'high', 'low', 'close', 'volume',
                'close_time', 'quote_volume', 'trades', 'taker_buy_base',
                'taker_buy_quote', 'ignore'
            ])
            
            df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
            df['open'] = df['open'].astype(float)
            df['high'] = df['high'].astype(float)
            df['low'] = df['low'].astype(float)
            df['close'] = df['close'].astype(float)
            df['volume'] = df['volume'].astype(float)
            
            df = df[['timestamp', 'open', 'high', 'low', 'close', 'volume']]
            
            logger.info(f"Fetched {len(df)} candles from Binance for {symbol}")
            
            return df
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Binance API request failed: {str(e)}")
            raise ExchangeError(f"Failed to fetch data from Binance: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error in Binance client: {str(e)}")
            raise ExchangeError(f"Binance error: {str(e)}")
