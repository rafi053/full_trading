class RiskManager:
    def __init__(self, max_trades_per_minute: int, position_size_limit: float, bot_stop_loss: float = None):
        self.max_trades_per_minute = max_trades_per_minute
        self.position_size_limit = position_size_limit
        self.bot_stop_loss = bot_stop_loss
    
    def can_open_new_trade(
        self,
        current_position_size: float,
        trades_this_minute: int
    ) -> tuple[bool, str]:
        if trades_this_minute >= self.max_trades_per_minute:
            return False, f"Max trades per minute reached ({self.max_trades_per_minute})"
        
        if current_position_size >= self.position_size_limit:
            return False, f"Position size limit reached: ${current_position_size:,.2f} >= ${self.position_size_limit:,.2f}"
        
        return True, "OK"
    
    def should_stop_bot(self, total_pnl: float) -> tuple[bool, str]:
        if self.bot_stop_loss is None:
            return False, "No bot stop loss set"
        
        if total_pnl <= self.bot_stop_loss:
            return True, f"Bot Stop Loss Hit: PnL ${total_pnl:.6f} <= ${self.bot_stop_loss:.6f}"
        
        return False, "OK"
