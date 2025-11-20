from collections import deque

def calculate_profit(
    entry_price: float,
    exit_price: float,
    qty: float,
    entry_fee: float,
    exit_fee_rate: float,
    is_long: bool = True
) -> float:
    exit_notional = qty * exit_price
    entry_notional = qty * entry_price
    
    if is_long:
        gross_profit = exit_notional - entry_notional
    else:
        gross_profit = entry_notional - exit_notional
    
    exit_fee = exit_notional * exit_fee_rate
    net_profit = gross_profit - entry_fee - exit_fee
    
    return net_profit

def get_current_position_size(open_trades: deque, current_price: float) -> float:
    if not open_trades or not current_price:
        return 0.0
    
    total_size = 0.0
    for trade in open_trades:
        qty = trade.get('qty', 0)
        total_size += qty * current_price
    
    return total_size

def get_unrealized_pnl(
    open_trades: deque,
    current_price: float,
    exit_fee_rate: float,
    is_long: bool = True
) -> float:
    if not open_trades or not current_price:
        return 0.0
    
    total_unrealized = 0.0
    
    for trade in open_trades:
        if is_long:
            entry_price = trade.get('buy_fill_price', 0)
            entry_fee = trade.get('buy_fee_usdt', 0.0)
        else:
            entry_price = trade.get('sell_fill_price', 0)
            entry_fee = trade.get('sell_fee_usdt', 0.0)
        
        qty = trade.get('qty', 0)
        
        pnl = calculate_profit(
            entry_price=entry_price,
            exit_price=current_price,
            qty=qty,
            entry_fee=entry_fee,
            exit_fee_rate=exit_fee_rate,
            is_long=is_long
        )
        
        total_unrealized += pnl
    
    return total_unrealized

def get_total_pnl(
    open_trades: deque,
    realized_pnl: float,
    current_price: float,
    exit_fee_rate: float,
    is_long: bool = True
) -> float:
    unrealized = get_unrealized_pnl(open_trades, current_price, exit_fee_rate, is_long)
    return realized_pnl + unrealized
