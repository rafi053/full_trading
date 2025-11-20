from trading_bots.exchange.bitunix_balance import BitunixBalance

class BalanceService:
    def __init__(self):
        self.bitunix = BitunixBalance()
    
    def get_bitunix_balance(self):
        try:
            balances = self.bitunix.get_balance()
            return balances
        except Exception as e:
            print(f"Error fetching Bitunix balances: {e}")
            return []
    
    def get_all_balances(self):
        return self.get_bitunix_balance()