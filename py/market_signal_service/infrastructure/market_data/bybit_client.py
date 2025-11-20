import requests
import pandas as pd
from typing import List
from market_signal_service.core.exceptions import ExchangeError, NoDataError
from market_signal_service.infrastructure.logging.logger import get_logger

logger = get_logger(__name__)

class BybitClient:
    BASE_URL = "https://api.bybit.com/v5"
    
    def __init__(self):
        self.session = requests.Session()
    
    def get_klines(self, symbol: str, interval: str, limit: int = 300) -> pd.DataFrame:
        try:
            url = f"{self.BASE_URL}/market/kline"
            params = {
                'category': 'spot',
                'symbol': symbol,
                'interval': interval,
                'limit': limit
            }
            
            logger.debug(f"Fetching klines from Bybit: {symbol} {interval}")
            
            response = self.session.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            result = response.json()
            
            if result.get('retCode') != 0:
                raise ExchangeError(f"Bybit API error: {result.get('retMsg')}")
            
            data = result.get('result', {}).get('list', [])
            
            if not data or len(data) == 0:
                raise NoDataError(f"No data returned from Bybit for {symbol}")
            
            df = pd.DataFrame(data, columns=[
                'timestamp', 'open', 'high', 'low', 'close', 'volume', 'turnover'
            ])
            
            df['timestamp'] = pd.to_datetime(df['timestamp'].astype(float), unit='ms')
            df['open'] = df['open'].astype(float)
            df['high'] = df['high'].astype(float)
            df['low'] = df['low'].astype(float)
            df['close'] = df['close'].astype(float)
            df['volume'] = df['volume'].astype(float)
            
            df = df[['timestamp', 'open', 'high', 'low', 'close', 'volume']]
            df = df.sort_values('timestamp').reset_index(drop=True)
            
            logger.info(f"Fetched {len(df)} candles from Bybit for {symbol}")
            
            return df
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Bybit API request failed: {str(e)}")
            raise ExchangeError(f"Failed to fetch data from Bybit: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error in Bybit client: {str(e)}")
            raise ExchangeError(f"Bybit error: {str(e)}")
