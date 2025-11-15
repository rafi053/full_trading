# Installation Guide

## 📦 Quick Installation

You have the complete trading bots architecture in a compressed archive: `trading_bots.tar.gz`

### Option 1: Extract the Archive

```bash
# Download the archive to your server
# Then extract it
tar -xzf trading_bots.tar.gz
cd trading_bots

# Install dependencies
pip install -r requirements.txt

# Configure your first bot
nano config/bot_long_example.json

# Run it!
python runner/run_long_bot.py config/bot_long_example.json
```

### Option 2: Manual File Copy

If you prefer to create files manually or review each one:

1. Create the directory structure:
```bash
mkdir -p trading_bots/{core,exchange,bots,regime,runner,config}
cd trading_bots
```

2. Copy all Python files from the archive or recreate them based on the code shown

3. Follow the Quick Start guide

---

## 📋 What's Included

### Complete Project (38 files)
- **21 Python files** (~1,320 lines of production code)
- **4 JSON config files** (templates ready to use)
- **5 Documentation files** (guides and references)
- **5 Package markers** (__init__.py files)
- **1 Requirements file**
- **2 Archive files** (tar.gz and directory)

### All Components
✅ Core utilities (logging, config, persistence, risk, indicators)
✅ Exchange integration (Bitunix API wrapper)
✅ Bot strategies (Long dips, Short rips)
✅ Regime detection framework
✅ Runner scripts
✅ Example configurations
✅ Complete documentation

---

## 🚀 First-Time Setup

### Step 1: Extract and Navigate
```bash
tar -xzf trading_bots.tar.gz
cd trading_bots
```

### Step 2: Install Dependencies
```bash
pip install requests

# Make sure you have your bitunix package installed
# If not, install it or place bitunix_helper.py in the correct location
```

### Step 3: Configure API Keys
```bash
# Copy example config
cp config/bot_long_example.json config/my_first_bot.json

# Edit with your credentials
nano config/my_first_bot.json
```

Edit these fields:
```json
{
  "botId": "my_first_bot",
  "credentials": {
    "apiKey": "YOUR_ACTUAL_API_KEY",
    "apiSecret": "YOUR_ACTUAL_API_SECRET"
  }
}
```

### Step 4: Test Run
```bash
# Start small!
python runner/run_long_bot.py config/my_first_bot.json
```

### Step 5: Monitor
Watch the colored output:
- 🟢 GREEN = Normal
- 🟡 YELLOW = Warnings  
- 🔴 RED = Errors
- 🟣 PURPLE = Critical events

Press `Ctrl+C` to stop gracefully.

---

## 📁 Directory Structure After Installation

```
trading_bots/
├── 📚 Documentation
│   ├── README.md              # Main documentation
│   ├── QUICKSTART.md          # 5-minute guide
│   ├── MIGRATION_GUIDE.md     # Migration from old bots
│   ├── ARCHITECTURE.md        # Technical details
│   ├── PROJECT_SUMMARY.md     # Overview
│   └── INSTALLATION.md        # This file
│
├── ⚙️ Configuration
│   ├── config/bot_long_example.json
│   ├── config/bot_short_example.json
│   ├── config/global_settings.json
│   └── config/regime_example.json
│
├── 🧩 Core Modules
│   ├── core/config_loader.py
│   ├── core/logger.py
│   ├── core/persistence.py
│   ├── core/risk_manager.py
│   ├── core/position_tracker.py
│   └── core/indicators.py
│
├── 🔌 Exchange Layer
│   ├── exchange/bitunix_client.py
│   └── exchange/exchange_factory.py
│
├── 🤖 Bot Strategies
│   ├── bots/base_bot.py
│   ├── bots/long_dip_bot.py
│   └── bots/short_rip_bot.py
│
├── 📊 Regime Detection
│   ├── regime/regime_types.py
│   └── regime/regime_selector.py
│
├── 🚀 Runners
│   ├── runner/run_long_bot.py
│   ├── runner/run_short_bot.py
│   └── runner/run_with_regime.py
│
└── 🔧 Dependencies
    └── requirements.txt
```

---

## 🔧 Integration with Existing Setup

### If You Have Existing Bots

**Good news:** This architecture is 100% compatible!

1. **Keep your old bots running** (if you want)
2. **Copy your config files** to `config/`
3. **Your state files work** - same format
4. **Test the new bot** alongside the old one
5. **Migrate gradually** - no rush!

### If You Have Custom Bitunix Integration

Replace this line in `exchange/bitunix_client.py`:
```python
from bitunix.bitunix_helper import BitunixAPI
```

With your import path:
```python
from your.custom.path import BitunixAPI
```

---

## 🎯 Verification Checklist

After installation, verify:

### Files Created
```bash
# Check core modules
ls core/
# Should show: 6 .py files + __init__.py

# Check bots
ls bots/
# Should show: 3 .py files + __init__.py

# Check runners
ls runner/
# Should show: 3 .py files + __init__.py
```

### Python Imports Work
```bash
cd trading_bots
python3 -c "from core.config_loader import load_config; print('✓ Core works')"
python3 -c "from bots.base_bot import BaseBot; print('✓ Bots work')"
python3 -c "from exchange.bitunix_client import BitunixClient; print('✓ Exchange works')"
```

### Config Files Valid
```bash
python3 -c "import json; json.load(open('config/bot_long_example.json')); print('✓ Config valid')"
```

---

## 🐛 Troubleshooting

### "No module named 'bitunix'"
**Solution:** Install your Bitunix package or adjust the import path in `exchange/bitunix_client.py`

### "Permission denied"
**Solution:** 
```bash
chmod -R 755 trading_bots/
chmod +x runner/*.py
```

### "Config file not found"
**Solution:** Make sure you're running from the `trading_bots/` directory or use absolute paths

### Import errors
**Solution:** Make sure all `__init__.py` files exist in each directory

---

## 🔄 Updating from Archive

If you get an updated version:

```bash
# Backup your configs
cp -r config/ config_backup/

# Extract new version
tar -xzf trading_bots_new.tar.gz

# Restore your configs
cp config_backup/*.json config/

# Test
python runner/run_long_bot.py config/your_bot.json
```

---

## 📦 Production Deployment

### With PM2 (Recommended)
```bash
# Install PM2
npm install -g pm2

# Start bots
pm2 start runner/run_long_bot.py --name btc-long --interpreter python3 -- config/btc_long.json
pm2 start runner/run_short_bot.py --name btc-short --interpreter python3 -- config/btc_short.json

# Save configuration
pm2 save

# Auto-start on reboot
pm2 startup
```

### With systemd
```bash
# Create service file
sudo nano /etc/systemd/system/trading-bot-long.service
```

```ini
[Unit]
Description=Trading Bot - Long Strategy
After=network.target

[Service]
Type=simple
User=your_user
WorkingDirectory=/path/to/trading_bots
ExecStart=/usr/bin/python3 runner/run_long_bot.py config/btc_long.json
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start
sudo systemctl enable trading-bot-long
sudo systemctl start trading-bot-long
sudo systemctl status trading-bot-long
```

### With Docker
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY trading_bots/ /app/
RUN pip install -r requirements.txt

CMD ["python", "runner/run_long_bot.py", "config/bot_long_example.json"]
```

```bash
docker build -t trading-bot .
docker run -d --name btc-long trading-bot
```

---

## 📊 Monitoring Setup

### Log Files
```bash
# Real-time monitoring
tail -f logs/bot_*.log

# With color support
tail -f logs/bot_*.log | ccze -A
```

### System Monitoring
```bash
# Check bot is running
ps aux | grep run_long_bot

# Resource usage
top -p $(pgrep -f run_long_bot)
```

### Health Checks
Create a simple health check script:

```python
#!/usr/bin/env python3
import json
import sys
from datetime import datetime, timedelta

# Check if bot has updated state recently
state_file = 'bot_trades/my_bot_trades.json'
with open(state_file) as f:
    data = json.load(f)

last_update = datetime.fromisoformat(data['last_updated'])
if datetime.now() - last_update > timedelta(minutes=10):
    print("⚠️ Bot may be stuck!")
    sys.exit(1)
else:
    print("✅ Bot is healthy")
    sys.exit(0)
```

---

## 🎓 Next Steps

1. ✅ Installation complete
2. 📖 Read `QUICKSTART.md` for first run
3. 🧪 Test with small amounts
4. 📊 Monitor for 24 hours
5. ⚙️ Tune thresholds
6. 🚀 Scale up gradually

---

## 📞 Support

- **Quick questions**: Check `QUICKSTART.md`
- **Technical details**: Check `ARCHITECTURE.md`
- **Migration help**: Check `MIGRATION_GUIDE.md`
- **General usage**: Check `README.md`

---

## ✅ Installation Complete!

You now have a complete, production-ready trading bot system.

**Your installation includes:**
- ✅ Modular architecture
- ✅ Two trading strategies
- ✅ Complete documentation
- ✅ Production infrastructure
- ✅ Extension framework

**Time to first trade:** < 5 minutes from here!

Good luck and happy trading! 🚀📈
