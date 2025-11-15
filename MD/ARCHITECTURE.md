# Architecture Overview

## 🏛️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         RUNNER LAYER                         │
│  (Entry points - what you execute from command line)        │
│                                                              │
│  run_long_bot.py    run_short_bot.py    run_with_regime.py │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                          BOT LAYER                           │
│         (Strategy implementation - when to trade)            │
│                                                              │
│    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│    │  BaseBot     │  │ LongDipBot   │  │ ShortRipBot  │   │
│    │  (abstract)  │  │ (buy dips)   │  │ (sell rips)  │   │
│    └──────────────┘  └──────────────┘  └──────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
┌────────────────┐  ┌────────────┐  ┌─────────────┐
│   CORE LAYER   │  │  EXCHANGE  │  │   REGIME    │
│  (shared logic)│  │   LAYER    │  │    LAYER    │
│                │  │ (API comm) │  │  (market    │
│ • Logger       │  │            │  │   state)    │
│ • Config       │  │ • Bitunix  │  │             │
│ • Persistence  │  │ • (Future) │  │ • Types     │
│ • Risk Mgr     │  │   Bybit    │  │ • Selector  │
│ • Position     │  │   KuCoin   │  │             │
│ • Indicators   │  │            │  │             │
└────────────────┘  └────────────┘  └─────────────┘
```

## 🔄 Data Flow

### Bot Initialization
```
Command Line
     │
     ▼
Runner (run_long_bot.py)
     │
     ├─► Load Config (config_loader.py)
     │
     ├─► Setup Logger (logger.py)
     │
     ├─► Create Exchange Client (bitunix_client.py)
     │
     └─► Create Bot Instance (long_dip_bot.py)
              │
              ├─► Load State (persistence.py)
              │
              ├─► Initialize Risk Manager (risk_manager.py)
              │
              └─► Start Main Loop (base_bot.py)
```

### Trading Cycle
```
Main Loop (base_bot.py)
     │
     ├─► Get Current Price (exchange/bitunix_client.py)
     │
     ├─► Check TP/SL (base_bot.py + bot-specific logic)
     │        │
     │        └─► If Hit: Close All → Stop Bot
     │
     ├─► Process Exit Targets (base_bot.py)
     │        │
     │        └─► should_exit_trade() [bot-specific]
     │                 │
     │                 └─► execute_exit() [bot-specific]
     │
     ├─► Check Entry Signal (bot-specific)
     │        │
     │        ├─► detect_dip/rip (indicators.py)
     │        │
     │        ├─► can_open_new_trade() (risk_manager.py)
     │        │
     │        └─► place_order() (exchange/bitunix_client.py)
     │                 │
     │                 └─► register_trade() [bot-specific]
     │                          │
     │                          └─► save_state() (persistence.py)
     │
     └─► Status Report (every 5 min)
              │
              └─► calculate_total_pnl() (position_tracker.py)
```

## 🧩 Module Dependencies

```
runner/
  ├─► core/config_loader
  ├─► core/logger
  ├─► exchange/bitunix_client
  └─► bots/long_dip_bot or short_rip_bot

bots/base_bot
  ├─► core/config_loader (BotConfig)
  ├─► core/persistence (save/load state)
  ├─► core/risk_manager (RiskManager)
  ├─► core/position_tracker (PnL calculations)
  └─► exchange/bitunix_client (API calls)

bots/long_dip_bot (extends base_bot)
  ├─► core/indicators (detect_dip)
  └─► core/position_tracker (calculate_profit)

bots/short_rip_bot (extends base_bot)
  ├─► core/indicators (detect_rip)
  └─► core/position_tracker (calculate_profit)

exchange/bitunix_client
  └─► logging (for error reporting)

core/persistence
  └─► No dependencies (pure I/O)

core/indicators
  └─► No dependencies (pure math)
```

## 🎭 Class Hierarchy

```
BaseBot (ABC)
├─── Methods:
│    ├─► run() - main loop [implemented]
│    ├─► check_tp_sl() - TP/SL logic [implemented]
│    ├─► process_exit_targets() - exit loop [implemented]
│    ├─► close_all_positions() - emergency close [implemented]
│    ├─► save_state() - persistence [implemented]
│    │
│    └─► Abstract methods (must implement):
│         ├─► check_entry_signal()
│         ├─► should_exit_trade()
│         ├─► execute_exit()
│         ├─► close_position()
│         ├─► calculate_trade_pnl()
│         ├─► should_trigger_tp()
│         ├─► should_trigger_sl()
│         ├─► is_long_bot()
│         └─► get_exit_fee_rate()
│
├─── LongDipBot (implements BaseBot)
│    ├─► check_entry_signal() - detects dips
│    ├─► should_exit_trade() - price >= target
│    ├─► execute_exit() - sell position
│    ├─► should_trigger_tp() - price >= TP
│    └─► should_trigger_sl() - price <= SL
│
└─── ShortRipBot (implements BaseBot)
     ├─► check_entry_signal() - detects rips
     ├─► should_exit_trade() - price <= target
     ├─► execute_exit() - buy back position
     ├─► should_trigger_tp() - price <= TP
     └─► should_trigger_sl() - price >= SL
```

## 📦 State Management

```
Bot State File: bot_trades/{bot_id}_trades.json

┌─────────────────────────────────────┐
│ {                                   │
│   "open_trades": [                  │
│     {                               │
│       "qty": 0.01,                  │
│       "target_price": 48500.0,      │
│       "buy_fill_price": 48000.0,    │◄─── Long Bot
│       "buy_fee_usdt": 0.288,        │     (or sell_fill_price for Short)
│       "created_at": "2025-01-15..." │
│     }                               │
│   ],                                │
│   "total_realized_pnl": 5.67,       │
│   "last_updated": "2025-01-15..."   │
│ }                                   │
└─────────────────────────────────────┘
         ▲                  │
         │                  │
    load_state()       save_state()
    (on startup)      (after each trade)
```

## 🔀 Strategy Pattern

The architecture uses the **Strategy Pattern** for trading logic:

```
┌──────────────────────────────────────────┐
│          Trading Strategy                │
│                                          │
│  Interface (BaseBot):                    │
│  • When to enter? check_entry_signal()  │
│  • When to exit?  should_exit_trade()   │
│                                          │
└──────────────────────────────────────────┘
         ▲                    ▲
         │                    │
    ┌────┴────┐         ┌─────┴─────┐
    │  Long   │         │   Short   │
    │  Dip    │         │    Rip    │
    │ Strategy│         │  Strategy │
    └─────────┘         └───────────┘

All strategies share:
• Same main loop
• Same persistence
• Same risk checks
• Same logging
```

## 🏭 Factory Pattern

The architecture uses **Factory Pattern** for exchange clients:

```
exchange_factory.py

create_exchange_client(name, key, secret)
         │
         ├─► "bitunix" → BitunixClient
         │
         ├─► "bybit"   → BybitClient (future)
         │
         └─► "kucoin"  → KuCoinClient (future)

All clients implement same interface:
• get_ticker(symbol)
• place_order(symbol, side, qty)
• get_open_positions(symbol)
• get_lot_size_filter(symbol)
```

## 🧪 Extension Points

### Adding a New Strategy

```python
# 1. Create new bot class
class MyNewBot(BaseBot):
    def check_entry_signal(self, current_price, prev_price):
        # Your signal logic (e.g., RSI, MACD, etc.)
        pass
    
    def should_exit_trade(self, trade, current_price):
        # Your exit logic
        pass
    
    # Implement other required methods...

# 2. Create runner script
# runner/run_my_bot.py
bot = MyNewBot(config, exchange, logger)
bot.run()

# 3. Run it!
# python runner/run_my_bot.py config/my_bot.json
```

### Adding a New Exchange

```python
# 1. Implement client in exchange/
class BybitClient:
    def get_ticker(self, symbol):
        # Bybit-specific API call
        pass
    
    def place_order(self, ...):
        # Bybit-specific order placement
        pass
    
    # Implement other required methods...

# 2. Register in factory
def create_exchange_client(exchange_name, ...):
    if exchange_name == 'bybit':
        return BybitClient(...)
    # ...

# 3. Use it!
# No changes needed in bot code!
```

### Adding New Indicators

```python
# Add to core/indicators.py
def calculate_rsi(prices, period=14):
    # RSI calculation
    pass

def detect_oversold(rsi_value, threshold=30):
    return rsi_value < threshold

# Use in your bot
from core import indicators

rsi = indicators.calculate_rsi(price_history)
if indicators.detect_oversold(rsi):
    self.execute_entry(current_price)
```

## 🔐 Risk Management Flow

```
Trade Request
     │
     ▼
┌─────────────────────────────────┐
│  Risk Manager Checks            │
│                                 │
│  1. Trades this minute < max?   │──NO──► Reject
│  2. Position size < limit?      │──NO──► Reject
│  3. Total PnL > bot stop loss?  │──NO──► Stop Bot
│                                 │
│  ALL YES ──────────────────────►│
└─────────────────────────────────┘
     │
     ▼
Execute Trade
     │
     ▼
Update State
     │
     └─► save_state()
```

## 📊 Performance Optimization

### Why This Architecture is Fast

1. **State Caching**: Position size calculated once per cycle
2. **Lazy Loading**: Only load state on startup
3. **Batch Operations**: Process all exit targets in one loop
4. **Connection Reuse**: Exchange client reuses HTTP session
5. **No Polling**: Uses price updates, not constant API calls

### Memory Footprint

```
Typical Bot Instance:
• Config object: ~1 KB
• Logger: ~5 KB
• Exchange client: ~10 KB
• Open trades (100): ~50 KB
• Total: ~66 KB per bot

You can run hundreds of bots on a single server!
```

## 🎯 Design Principles

1. **DRY (Don't Repeat Yourself)**
   - Common code in `core/` and `base_bot.py`
   - Strategy-specific code in bot classes

2. **Single Responsibility**
   - Each module does ONE thing well
   - Easy to test, easy to debug

3. **Open/Closed Principle**
   - Open for extension (new bots)
   - Closed for modification (don't change base)

4. **Dependency Inversion**
   - Bots depend on abstractions (interfaces)
   - Not on concrete implementations

5. **Composition Over Inheritance**
   - Bots "have" a RiskManager
   - Not "are" a RiskManager

## 🚀 Scaling Strategies

### Horizontal Scaling (Multiple Bots)
```
Server 1: LONG Bot (BTC)
Server 2: SHORT Bot (BTC)
Server 3: LONG Bot (ETH)
Server 4: SHORT Bot (ETH)
```

### Vertical Scaling (Multiple Symbols)
```
Single Process:
├─► Thread 1: BTC LONG
├─► Thread 2: BTC SHORT
├─► Thread 3: ETH LONG
└─► Thread 4: ETH SHORT
```

### Regime-Based Scaling
```
Regime Manager Process
├─► Detects: UPTREND
│   ├─► Start: LONG bots
│   └─► Stop: SHORT bots
│
└─► Detects: DOWNTREND
    ├─► Start: SHORT bots
    └─► Stop: LONG bots
```

---

This architecture gives you **maximum flexibility** with **minimum code duplication**.
