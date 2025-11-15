import time
import logging
from bitunix.bitunix_helper import BitunixAPI

class BitunixClient:
    def __init__(self, api_key: str, api_secret: str, logger: logging.Logger = None):
        self.api = BitunixAPI(api_key, api_secret)
        self.logger = logger or logging.getLogger(__name__)
    
    def safe_request(self, func, *args, max_retries=4, retry_delay=1.2, **kwargs):
        for attempt in range(1, max_retries + 1):
            try:
                result = func(*args, **kwargs)
                
                if isinstance(result, dict):
                    if result.get('code') == 0:
                        return result
                    else:
                        self.logger.error(f"API Error - Code: {result.get('code')}, Message: {result.get('msg')}")
                        if attempt == max_retries:
                            return result
                else:
                    return result
                    
            except Exception as e:
                self.logger.error(f"Request failed (attempt {attempt}/{max_retries}): {e}")
                if attempt == max_retries:
                    return None
                time.sleep(retry_delay * attempt)
        
        return None
    
    def get_ticker(self, symbol: str):
        result = self.safe_request(self.api.get, '/api/v1/futures/market/tickers', {'symbols': symbol})
        
        if not result or result.get('code') != 0:
            return None
        
        tickers = result.get('data', [])
        if tickers:
            ticker = tickers[0]
            price = float(ticker.get('lastPrice', 0))
            if price == 0:
                self.logger.error("lastPrice is 0 or missing!")
                return None
            return price
        
        return None
    
    def get_lot_size_filter(self, symbol: str):
        self.logger.info(f"Getting lot size filter for {symbol}")
        
        result = self.safe_request(self.api.get, '/api/v1/futures/market/trading_pairs', {'symbols': symbol})
        
        if not result or result.get('code') != 0:
            self.logger.error("Failed to get instrument info")
            return {'minOrderQty': 0.01, 'qtyStep': 0.01}
        
        instruments = result.get('data', [])
        if not instruments:
            self.logger.error("No instrument info found")
            return {'minOrderQty': 0.01, 'qtyStep': 0.01}
        
        instrument = instruments[0]
        min_qty = float(instrument.get('minTradeVolume', 0.01))
        base_precision = int(instrument.get('basePrecision', 4))
        qty_step = 10 ** (-base_precision)
        
        self.logger.info(f"  Min Qty: {min_qty}, Qty Step: {qty_step}, Base Precision: {base_precision}")
        
        return {'minOrderQty': min_qty, 'qtyStep': qty_step}
    
    def round_quantity(self, qty: float, lot_size: dict) -> float:
        qty_step = lot_size['qtyStep']
        min_qty = lot_size['minOrderQty']
        
        rounded = round(qty / qty_step) * qty_step
        rounded = max(rounded, min_qty)
        
        if qty_step >= 1:
            return int(rounded)
        elif qty_step >= 0.1:
            return round(rounded, 1)
        elif qty_step >= 0.01:
            return round(rounded, 2)
        else:
            return round(rounded, 3)
    
    def get_open_positions(self, symbol: str, trading_mode: str = 'LONG'):
        params = {'symbol': symbol}
        result = self.safe_request(self.api.get, '/api/v1/futures/position/get_pending_positions', params)
        
        if result and result.get('code') == 0:
            positions = result.get('data', [])
            
            open_positions = []
            for pos in positions:
                qty = float(pos.get('qty', 0))
                side = pos.get('side', '').upper()
                
                if qty != 0 and pos.get('symbol') == symbol:
                    if trading_mode.upper() == 'SHORT' and side == 'SELL':
                        open_positions.append(pos)
                    elif trading_mode.upper() == 'LONG' and side == 'BUY':
                        open_positions.append(pos)
            
            if open_positions:
                self.logger.info(f"Found {len(open_positions)} open positions:")
                for pos in open_positions:
                    self.logger.info(f"  - Side: {pos.get('side')}, Qty: {pos.get('qty')}, Entry: {pos.get('entryPrice', 'N/A')}")
            
            return open_positions
        else:
            self.logger.warning(f"Failed to get positions - Code: {result.get('code') if result else 'N/A'}, Msg: {result.get('msg') if result else 'No response'}")
            return []
    
    def place_order(
        self,
        symbol: str,
        side: str,
        qty: float,
        order_type: str = 'MARKET',
        trade_side: str = None,
        position_id: str = None,
        reduce_only: bool = False
    ):
        qty_str = str(qty)
        
        self.logger.info(f"{side} ORDER: {qty} {symbol} (Type: {order_type}, TradeSide: {trade_side})")
        
        body = {
            'symbol': symbol,
            'side': side,
            'orderType': order_type,
            'qty': qty_str
        }
        
        if trade_side:
            body['tradeSide'] = trade_side
        
        if position_id:
            body['positionId'] = position_id
        
        if reduce_only:
            body['reduceOnly'] = True
        
        result = self.safe_request(self.api.post, '/api/v1/futures/trade/place_order', body)
        
        if result and result.get('code') == 0:
            order_id = result.get('data', {}).get('orderId')
            self.logger.info(f"{side} order placed - Order ID: {order_id}, Qty: {qty}")
            return {'id': order_id, 'qty': qty}
        else:
            error_msg = result.get('msg', 'No response') if result else 'No response'
            error_code = result.get('code', 'N/A') if result else 'N/A'
            self.logger.error(f"{side} order failed - Code: {error_code}, Message: {error_msg}")
            return None
