import requests
import pandas as pd
from typing import List
from core.exceptions import ExchangeError, NoDataError
from infrastructure.logging.logger import get_logger

logger = get_logger(__name__)

class KuCoinClient:
    BASE_URL = "https://api.kucoin.com/api/v1"
    
    def __init__(self):
        self.session = requests.Session()
    
    def get_klines(self, symbol: str, interval: str, limit: int = 300) -> pd.DataFrame:
        try:
            url = f"{self.BASE_URL}/market/candles"
            
            interval_map = {
                '1m': '1min',
                '5m': '5min',
                '15m': '15min',
                '30m': '30min',
                '1h': '1hour',
                '4h': '4hour',
                '1d': '1day'
            }
            kucoin_interval = interval_map.get(interval, interval)
            
            params = {
                'symbol': symbol,
                'type': kucoin_interval
            }
            
            logger.debug(f"Fetching klines from KuCoin: {symbol} {kucoin_interval}")
            
            response = self.session.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            result = response.json()
            
            if result.get('code') != '200000':
                raise ExchangeError(f"KuCoin API error: {result.get('msg')}")
            
            data = result.get('data', [])
            
            if not data or len(data) == 0:
                raise NoDataError(f"No data returned from KuCoin for {symbol}")
            
            df = pd.DataFrame(data, columns=[
                'timestamp', 'open', 'close', 'high', 'low', 'volume', 'turnover'
            ])
            
            df['timestamp'] = pd.to_datetime(df['timestamp'].astype(float), unit='s')
            df['open'] = df['open'].astype(float)
            df['high'] = df['high'].astype(float)
            df['low'] = df['low'].astype(float)
            df['close'] = df['close'].astype(float)
            df['volume'] = df['volume'].astype(float)
            
            df = df[['timestamp', 'open', 'high', 'low', 'close', 'volume']]
            df = df.sort_values('timestamp').reset_index(drop=True)
            df = df.tail(limit)
            
            logger.info(f"Fetched {len(df)} candles from KuCoin for {symbol}")
            
            return df
            
        except requests.exceptions.RequestException as e:
            logger.error(f"KuCoin API request failed: {str(e)}")
            raise ExchangeError(f"Failed to fetch data from KuCoin: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error in KuCoin client: {str(e)}")
            raise ExchangeError(f"KuCoin error: {str(e)}")
