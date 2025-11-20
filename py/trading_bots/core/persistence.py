import json
import os
from datetime import datetime
from collections import deque
from typing import Dict, List, Any

def save_state(file_path: str, open_trades: deque, total_realized_pnl: float):
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    
    trades_list = []
    for trade in open_trades:
        trade_dict = dict(trade)
        if 'created_at' in trade_dict and isinstance(trade_dict['created_at'], datetime):
            trade_dict['created_at'] = trade_dict['created_at'].isoformat()
        trades_list.append(trade_dict)
    
    data = {
        'open_trades': trades_list,
        'total_realized_pnl': total_realized_pnl,
        'last_updated': datetime.now().isoformat()
    }
    
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=2)

def load_state(file_path: str) -> Dict[str, Any]:
    if not os.path.exists(file_path):
        return {
            'open_trades': deque(),
            'total_realized_pnl': 0.0
        }
    
    with open(file_path, 'r') as f:
        data = json.load(f)
    
    trades_list = data.get('open_trades', [])
    open_trades = deque()
    
    for trade_dict in trades_list:
        if 'created_at' in trade_dict and isinstance(trade_dict['created_at'], str):
            trade_dict['created_at'] = datetime.fromisoformat(trade_dict['created_at'])
        open_trades.append(trade_dict)
    
    total_realized_pnl = data.get('total_realized_pnl', 0.0)
    
    return {
        'open_trades': open_trades,
        'total_realized_pnl': total_realized_pnl
    }
