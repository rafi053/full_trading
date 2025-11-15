# Migration Guide: Old Bots → New Architecture

This guide shows you exactly how your old bot code maps to the new modular architecture.

## 🗺️ Code Mapping

### Old Code → New Structure

Here's where each part of your old single-file bot goes in the new architecture:

#### 1. **Imports & Setup (Lines 1-50)**

**Old location:** Top of `generic_trading_bot_bitunix.py`
```python
import sys
import time
from datetime import datetime
from collections import deque
import traceback
import logging
import json
import os
from bitunix.bitunix_helper import BitunixAPI

os.makedirs('logs', exist_ok=True)
```

**New location:** 
- Imports are handled in individual modules
- Directory creation: `core/logger.py` and `core/persistence.py`

---

#### 2. **Logger Setup (Lines 15-45)**

**Old location:** `ColoredFormatter` class and logging setup

**New location:** `core/logger.py`
```python
from core.logger import setup_logger
logger = setup_logger(bot_id)
```

**Benefits:** One logger implementation, all bots use it consistently.

---

#### 3. **Config Loading (Lines 50-80)**

**Old location:**
```python
CONFIG_PATH = sys.argv[1]
def load_bot_config(config_path):
    with open(config_path, 'r') as f:
        return json.load(f)
config = load_bot_config(CONFIG_PATH)
BOT_ID = config['botId']
API_KEY = config['credentials']['apiKey']
# ... etc
```

**New location:** `core/config_loader.py`
```python
from core.config_loader import load_config
config = load_config(config_path)
# Now access as: config.bot_id, config.api_key, etc.
```

**Benefits:** Type-safe config object, validation in one place.

---

#### 4. **API Client Setup (Lines 80-100)**

**Old location:**
```python
api = BitunixAPI(API_KEY, API_SECRET)

def safe_request(func, *args, max_retries=4, ...):
    # retry logic
```

**New location:** `exchange/bitunix_client.py`
```python
from exchange.bitunix_client import BitunixClient
exchange = BitunixClient(api_key, api_secret, logger)
# safe_request is now built into the client
```

**Benefits:** Reusable across all bots, easier to add new exchanges.

---

#### 5. **Lot Size Filter (Lines 100-150)**

**Old location:**
```python
def get_lot_size_filter():
    result = safe_request(api.get, '/api/v1/futures/market/trading_pairs', ...)
    # parsing logic
    return {'minOrderQty': ..., 'qtyStep': ...}

LOT_SIZE = get_lot_size_filter()

def round_quantity(qty: float) -> float:
    # rounding logic
```

**New location:** `exchange/bitunix_client.py`
```python
lot_size = exchange.get_lot_size_filter(symbol)
rounded_qty = exchange.round_quantity(qty, lot_size)
```

**Benefits:** Exchange-specific logic stays in exchange module.

---

#### 6. **State Persistence (Lines 150-200)**

**Old location:**
```python
FILE_NAME = f'bot_trades/{BOT_ID}_trades.json'
open_trades = deque()
total_realized_pnl = 0.0

def save_trades_to_file():
    # JSON serialization logic

def load_trades_from_file():
    # JSON loading logic
```

**New location:** `core/persistence.py`
```python
from core.persistence import save_state, load_state

state = load_state(config.get_state_file_path())
open_trades = state['open_trades']
total_realized_pnl = state['total_realized_pnl']

# Later:
save_state(file_path, open_trades, total_realized_pnl)
```

**Benefits:** Consistent state format, handles datetime serialization automatically.

---

#### 7. **Price Fetching (Lines 200-230)**

**Old location:**
```python
def get_price():
    result = safe_request(api.get, '/api/v1/futures/market/tickers', ...)
    tickers = result.get('data', [])
    if tickers:
        return float(ticker.get('lastPrice', 0))
```

**New location:** `exchange/bitunix_client.py`
```python
current_price = exchange.get_ticker(symbol)
```

**Benefits:** One-line call, error handling built-in.

---

#### 8. **Position Calculations (Lines 230-290)**

**Old location:**
```python
def calculate_current_position_size():
    current_price = get_price()
    total_size = 0.0
    for trade in open_trades:
        total_size += trade['qty'] * current_price
    return total_size

def calculate_profit(buy_price, sell_price, qty, ...):
    # PnL calculation logic

def calculate_unrealized_pnl():
    # loop through trades

def calculate_total_pnl():
    # unrealized + realized
```

**New location:** `core/position_tracker.py`
```python
from core import position_tracker

position_size = position_tracker.get_current_position_size(
    open_trades, current_price
)

pnl = position_tracker.calculate_profit(
    entry_price, exit_price, qty, fees, is_long=True
)

total_pnl = position_tracker.get_total_pnl(
    open_trades, realized_pnl, current_price, fee_rate, is_long=True
)
```

**Benefits:** Pure functions, easy to test, reusable.

---

#### 9. **Risk Checks (Lines 290-320)**

**Old location:**
```python
if trades_executed_this_minute >= MAX_TRADES_PER_MINUTE:
    log.warning("Max trades reached")
    return False

if current_position_size >= POSITION_SIZE_LIMIT:
    log.warning("Position limit reached")
    return False
```

**New location:** `core/risk_manager.py`
```python
from core.risk_manager import RiskManager

risk_manager = RiskManager(
    max_trades_per_minute=3,
    position_size_limit=5000,
    bot_stop_loss=-100
)

can_trade, msg = risk_manager.can_open_new_trade(
    position_size, trades_this_minute
)
```

**Benefits:** Centralized risk logic, consistent across all bots.

---

#### 10. **Order Placement (Lines 320-400)**

**Old location:**
```python
def buy_market(qty: float):
    positions = get_open_positions()
    body = {
        'symbol': SYMBOL,
        'side': 'BUY',
        # ... complex logic
    }
    result = safe_request(api.post, '/api/v1/futures/trade/place_order', body)
    # error handling

def sell_market(qty: float):
    # similar complex logic
```

**New location:** `exchange/bitunix_client.py`
```python
order = exchange.place_order(
    symbol=symbol,
    side='BUY',
    qty=qty,
    trade_side='OPEN'
)
```

**Benefits:** Simplified interface, handles position IDs automatically.

---

#### 11. **Entry Signal Detection (Lines 400-450)**

**Old location (LONG BOT):**
```python
drop = (prev_price - current_price) / prev_price
if drop >= BUY_THRESHOLD:
    log.warning(f"BUY SIGNAL: Drop {drop*100:.4f}%")
    execute_buy(QTY, current_price)
```

**Old location (SHORT BOT):**
```python
rise = (current_price - prev_price) / prev_price
if rise >= SELL_THRESHOLD:
    log.warning(f"SELL SIGNAL: Rise {rise*100:.4f}%")
    execute_sell(QTY, current_price)
```

**New location:** `bots/long_dip_bot.py` or `bots/short_rip_bot.py`
```python
from core import indicators

is_dip, drop = indicators.detect_dip(
    current_price, prev_price, threshold
)
if is_dip:
    self.execute_entry(current_price)
```

**Benefits:** Strategy logic separated from infrastructure.

---

#### 12. **Trade Registration (Lines 450-480)**

**Old location:**
```python
def register_exit(order, fill_price, qty, fee):
    target = fill_price * (1 + SELL_THRESHOLD)
    trade = {
        'qty': qty,
        'target_price': target,
        'buy_order_id': order.get('id'),
        'buy_fill_price': fill_price,
        'buy_fee_usdt': fee,
        'created_at': datetime.now()
    }
    open_trades.append(trade)
    save_trades_to_file()
```

**New location:** In the bot class (`long_dip_bot.py` or `short_rip_bot.py`)
```python
def register_trade(self, order, fill_price, qty, fee):
    target = fill_price * (1 + self.config.sell_threshold)
    trade = {
        'qty': qty,
        'target_price': target,
        # ... rest
    }
    self.open_trades.append(trade)
    self.save_state()
```

**Benefits:** Bot-specific logic stays in bot class.

---

#### 13. **Exit Target Processing (Lines 480-530)**

**Old location:**
```python
def process_exit_targets():
    if not open_trades:
        return
    curr = get_price()
    kept = deque()
    while open_trades:
        t = open_trades.popleft()
        if curr >= t['target_price']:  # or <= for short
            # execute sell/buy
        else:
            kept.append(t)
    open_trades.extend(kept)
```

**New location:** `bots/base_bot.py`
```python
def process_exit_targets(self):
    # Same logic, but calls bot-specific should_exit_trade()
    while self.open_trades:
        trade = self.open_trades.popleft()
        if self.should_exit_trade(trade, current_price):
            self.execute_exit(trade, current_price)
```

Each bot implements:
```python
def should_exit_trade(self, trade, current_price):
    # LONG: current_price >= target
    # SHORT: current_price <= target
```

**Benefits:** Common loop logic in base, strategy-specific in bot.

---

#### 14. **TP/SL Checks (Lines 530-580)**

**Old location:**
```python
def check_tp_sl(current_price):
    if TP_ENABLED and current_price >= TP_PRICE:  # or <= for short
        log.critical("TAKE PROFIT HIT")
        close_all_positions()
        stop_bot()
        return True
    # Similar for SL and Bot SL
```

**New location:** `bots/base_bot.py`
```python
def check_tp_sl(self, current_price):
    if self.config.tp_enabled and self.should_trigger_tp(current_price):
        # ... same logic
```

Each bot implements:
```python
def should_trigger_tp(self, current_price):
    # LONG: current_price >= tp_price
    # SHORT: current_price <= tp_price
```

**Benefits:** Framework in base, direction logic in bot.

---

#### 15. **Main Loop (Lines 600-700)**

**Old location:**
```python
def main():
    prev_price = get_price()
    while not bot_should_stop:
        current_price = get_price()
        check_tp_sl(current_price)
        process_exit_targets()
        # check for entry signal
        # status report
        time.sleep(5)
```

**New location:** `bots/base_bot.py`
```python
def run(self):
    # Same loop structure, but:
    # - Calls self.check_entry_signal() (implemented by bot)
    # - Uses self.config, self.exchange, etc.
```

**Benefits:** One main loop for all bots, extensible.

---

#### 16. **Entry Point (Lines 700+)**

**Old location:**
```python
if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        log.error(f"Fatal error: {e}")
```

**New location:** `runner/run_long_bot.py` or `runner/run_short_bot.py`
```python
def main():
    config = load_config(sys.argv[1])
    logger = setup_logger(config.bot_id)
    exchange = BitunixClient(...)
    bot = LongDipBot(config, exchange, logger)
    bot.run()
```

**Benefits:** Clean entry point, easy to run multiple bots.

---

## 📊 Summary Table

| Old Code Section | New Location | Lines Saved |
|-----------------|--------------|-------------|
| Logger setup | `core/logger.py` | ~30 |
| Config loading | `core/config_loader.py` | ~25 |
| API client + retries | `exchange/bitunix_client.py` | ~80 |
| Lot size logic | `exchange/bitunix_client.py` | ~40 |
| State persistence | `core/persistence.py` | ~50 |
| Position calculations | `core/position_tracker.py` | ~60 |
| Risk checks | `core/risk_manager.py` | ~30 |
| Main loop | `bots/base_bot.py` | ~100 |
| **Total shared code** | | **~415 lines** |
| **Bot-specific logic** | `bots/long_dip_bot.py` | **~150 lines** |

## 🎯 What You Actually Write Now

For a new bot, you only need to write:

1. **Entry signal detection** (~15 lines)
2. **Exit condition** (~5 lines)
3. **TP/SL direction** (~8 lines)
4. **Config file** (JSON)

Everything else is handled by the framework!

## 🔄 Step-by-Step Migration

1. **Copy your config:**
   ```bash
   cp your_old_config.json trading_bots/config/my_bot.json
   ```

2. **Run with new architecture:**
   ```bash
   cd trading_bots
   python runner/run_long_bot.py config/my_bot.json
   ```

3. **That's it!** Your old state files will be loaded automatically.

## ✅ Compatibility

The new architecture is **100% compatible** with your old state files:
- Same JSON format for `bot_trades/{bot_id}_trades.json`
- Same config structure
- Same API calls to Bitunix

You can switch between old and new bots without losing data.

## 🚀 Next Steps

After migrating, you can:
- Run multiple bots easily
- Add new exchanges by implementing one client class
- Create new strategies by extending BaseBot
- Enable regime-based automation

---

**Questions?** Check the README.md or look at the code comments!
