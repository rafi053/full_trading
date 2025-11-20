import os
from dotenv import load_dotenv
from trading_bots.exchange.bitunixAPI import BitunixAPI

load_dotenv()

class BitunixBalance:
    def __init__(self):
        self.api_key = os.getenv('BITUNIX_API_KEY')
        self.api_secret = os.getenv('BITUNIX_API_SECRET')
        self.api = BitunixAPI(self.api_key, self.api_secret)
    
    def get_balance(self):
        try:
            response = self.api.get('/api/v1/futures/account', {'marginCoin': 'USDT'})
            
            if response.get('code') != 0:
                print(f"Bitunix API error: {response.get('msg', 'Unknown error')}")
                return []
            
            account_data = response.get('data', {})
            
            available = float(account_data.get('available', 0))
            margin = float(account_data.get('margin', 0))
            unrealized_pnl = float(account_data.get('crossUnrealizedPNL', 0))
            total_equity = available + margin + unrealized_pnl
            
            balances = []
            
            if total_equity > 0 or margin > 0:
                balances.append({
                    'exchange': 'Bitunix',
                    'asset': 'USDT',
                    'free': available,
                    'locked': margin,
                    'total': total_equity,
                    'unrealizedPnl': unrealized_pnl
                })
            
            return balances
            
        except Exception as e:
            print(f"Bitunix balance error: {e}")
            return []