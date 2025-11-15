# Quick Start Guide

Get your bot running in 5 minutes!

## ⚡ Super Quick Start

```bash
# 1. Navigate to the project
cd trading_bots

# 2. Edit config (add your API keys)
nano config/bot_long_example.json

# 3. Run the bot!
python runner/run_long_bot.py config/bot_long_example.json
```

That's it! 🎉

---

## 📋 Detailed Setup

### Step 1: Install Dependencies

```bash
pip install requests
```

Make sure you also have your `bitunix` package installed (the `bitunix_helper.py` you're already using).

### Step 2: Configure Your Bot

Copy and edit one of the example configs:

```bash
cp config/bot_long_example.json config/my_bot.json
nano config/my_bot.json
```

**Required changes:**
```json
{
  "botId": "my_first_bot",           // ← Unique ID for your bot
  "credentials": {
    "apiKey": "YOUR_ACTUAL_API_KEY",      // ← Your Bitunix API key
    "apiSecret": "YOUR_ACTUAL_API_SECRET"  // ← Your Bitunix API secret
  },
  "tradingParams": {
    "symbol": "BTCUSDT",              // ← Trading pair
    "quantity": 0.01                  // ← Order size (start small!)
  }
}
```

### Step 3: Choose Your Strategy

**For LONG (Buy Dips) Bot:**
```bash
python runner/run_long_bot.py config/my_bot.json
```

**For SHORT (Sell Rips) Bot:**
```bash
# Make sure tradingMode is "SHORT" in config
python runner/run_short_bot.py config/my_bot.json
```

### Step 4: Monitor

Watch the colored console output:
- 🟢 **GREEN** = Normal operations
- 🟡 **YELLOW** = Warnings (limits reached)
- 🔴 **RED** = Errors (API issues)
- 🟣 **PURPLE** = Critical (TP/SL hit, bot stopping)

Logs are also saved to `logs/bot_{bot_id}_{timestamp}.log`

---

## 🎛️ Configuration Explained

### Trading Parameters

```json
"tradingParams": {
  "symbol": "BTCUSDT",           // What to trade
  "quantity": 0.01,              // How much per trade
  "tradingMode": "LONG",         // "LONG" or "SHORT"
  "desiredPositionSize": 1000    // Target position size in USDT
}
```

### Thresholds (Most Important!)

**For LONG Bot:**
```json
"thresholds": {
  "buyThreshold": 0.005,         // Buy when price drops 0.5%
  "sellThreshold": 0.008,        // Sell when price rises 0.8% from entry
  "maxTradesPerMinute": 3,       // Safety limit
  "positionSizeLimit": 5000      // Max total position value
}
```

**For SHORT Bot:**
```json
"thresholds": {
  "sellThreshold": 0.005,        // Sell when price rises 0.5%
  "buyThreshold": 0.008,         // Buy back when price drops 0.8% from entry
  "maxTradesPerMinute": 3,
  "positionSizeLimit": 5000
}
```

### Optional: Take Profit / Stop Loss

```json
"takeProfit": {
  "enabled": true,
  "priceLevel": 50000           // Close all at $50,000
},
"stopLoss": {
  "enabled": true,
  "priceLevel": 45000,          // Close all at $45,000
  "botStopLoss": -100           // Stop bot if total PnL <= -$100
}
```

---

## 🔍 What Happens When You Run It?

```
1. Bot loads config ✓
2. Connects to Bitunix ✓
3. Gets lot size rules ✓
4. Loads previous state (if any) ✓
5. Starts main loop:
   ├─► Get current price
   ├─► Check TP/SL
   ├─► Process exit targets (close profitable trades)
   ├─► Check for entry signal (dips/rips)
   └─► Status report every 5 minutes
```

---

## 📊 Understanding the Output

### Normal Operation
```
2025-01-15 10:30:00 - INFO - Bot started: my_first_bot
2025-01-15 10:30:01 - INFO - Start price: $48,234.50 | Open trades: 0
2025-01-15 10:35:00 - INFO - Status: Price $48,234.50 | Open: 0 | Position: $0.00 | Total PnL: $0.00
```

### When Signal Detected
```
2025-01-15 10:36:12 - WARNING - BUY SIGNAL: Drop 0.5234% | From $48,234.50 to $47,982.10
2025-01-15 10:36:13 - INFO - BUY ORDER: 0.01 BTCUSDT
2025-01-15 10:36:14 - INFO - BUY order placed - Order ID: 12345, Qty: 0.01
2025-01-15 10:36:14 - INFO - Trade registered - Buy: $47,982.10, Target: $48,365.72
```

### When Target Hit
```
2025-01-15 10:42:08 - INFO - TARGET HIT - Buy $47,982.10 -> Sell $48,401.25 = PnL $4.19
```

### When TP/SL Hit
```
2025-01-15 11:00:00 - CRITICAL - TAKE PROFIT HIT: 50000.00 >= 50000.00
2025-01-15 11:00:01 - WARNING - CLOSING ALL POSITIONS
2025-01-15 11:00:05 - WARNING - Closed 3 positions. Total PnL: $67.84
```

---

## 🛑 Stopping the Bot

### Graceful Stop
Press `Ctrl+C` once:
```
2025-01-15 12:00:00 - WARNING - Stopped by user
2025-01-15 12:00:00 - INFO - Bot stopped
2025-01-15 12:00:00 - INFO - Final Total PnL: $42.37
```

The bot will:
- Save current state
- Update config status
- Exit cleanly

### Emergency Stop
Send SIGTERM signal (e.g., from PM2 or Docker):
```
kill -TERM <pid>
```

Same graceful shutdown will occur.

---

## 📁 Files Generated

After running, you'll see:

```
trading_bots/
├── bot_trades/
│   └── my_first_bot_trades.json    ← Your open trades
│
└── logs/
    └── bot_my_first_bot_20250115_103000.log  ← Full log file
```

### State File (bot_trades/)
```json
{
  "open_trades": [
    {
      "qty": 0.01,
      "target_price": 48365.72,
      "buy_fill_price": 47982.10,
      "buy_fee_usdt": 0.288,
      "created_at": "2025-01-15T10:36:14"
    }
  ],
  "total_realized_pnl": 12.45,
  "last_updated": "2025-01-15T11:30:00"
}
```

This file ensures your bot **remembers everything** if it restarts!

---

## 🔧 Common Issues

### "No module named 'bitunix'"
Install your Bitunix helper:
```bash
pip install bitunix-api
# or wherever your bitunix_helper.py is
```

### "API Error - Code: 401"
Check your API credentials in the config file.

### "Position size limit reached"
Increase `positionSizeLimit` in config, or wait for trades to close.

### No trades executing
- Check if thresholds are too tight (price not moving enough)
- Verify symbol is actively trading
- Check `maxTradesPerMinute` isn't 0

---

## 🎯 Best Practices for Beginners

### Start Small
```json
{
  "quantity": 0.001,              // Very small orders
  "positionSizeLimit": 100,       // Low limit
  "stopLoss": {
    "botStopLoss": -10            // Stop at -$10 loss
  }
}
```

### Conservative Thresholds
```json
{
  "buyThreshold": 0.01,           // 1% move to trigger
  "sellThreshold": 0.015,         // 1.5% profit target
  "maxTradesPerMinute": 2         // Slow down
}
```

### Monitor First Hour
Watch the logs closely for the first hour to understand:
- How often signals trigger
- Typical PnL per trade
- Position size usage

### Gradual Increase
Once comfortable:
1. Increase `quantity` slowly
2. Adjust thresholds based on market
3. Raise `positionSizeLimit` carefully

---

## 🚀 Running Multiple Bots

### Different Symbols
```bash
# Terminal 1
python runner/run_long_bot.py config/btc_long.json

# Terminal 2
python runner/run_long_bot.py config/eth_long.json
```

### Long + Short on Same Symbol
```bash
# Terminal 1
python runner/run_long_bot.py config/btc_long.json

# Terminal 2
python runner/run_short_bot.py config/btc_short.json
```

Each bot is **completely independent**!

---

## 📞 Next Steps

1. **Read the full README.md** for detailed features
2. **Check MIGRATION_GUIDE.md** if converting old bots
3. **Review ARCHITECTURE.md** to understand the design
4. **Experiment with thresholds** to find what works for you
5. **Set up monitoring** (PM2, systemd, etc.) for production

---

## ⚠️ Final Reminder

**This is real money trading!** 

- Test thoroughly with small amounts first
- Never risk more than you can afford to lose
- Monitor your bots regularly
- Start with paper trading if available
- Understand the markets you're trading

---

**Happy Trading! 🚀📈**

For questions or issues, check the docs or review the code comments.
