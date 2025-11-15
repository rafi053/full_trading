# Market Signal Service

A professional market signal service that provides BUY/SELL/HOLD signals based on technical indicators.

## Features

- **Multiple Exchanges**: Binance, Bybit, KuCoin
- **Technical Indicators**: MA, EMA, RSI, MACD, Stochastic, ADX, Market Structure
- **Signal Generation**: BUY/SELL/HOLD based on weighted scoring
- **Caching**: Built-in cache for improved performance
- **RESTful API**: FastAPI with automatic documentation

## Architecture

The service follows a clean, layered architecture:

```
API Layer (routes, controllers, schemas)
    ↓
Domain Layer (services, engine, models)
    ↓
Infrastructure Layer (market data, cache, config)
```

## Installation

1. Clone the repository
2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

## Running the Service

```bash
python app.py
```

Or with uvicorn:
```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### GET /api/v1/signal

Get market signal for a symbol.

**Parameters:**
- `symbol` (required): Trading pair (e.g., BTCUSDT)
- `timeframe` (optional): Timeframe (default: 1h)
- `exchange` (optional): Exchange (default: binance)

**Example:**
```bash
curl "http://localhost:8000/api/v1/signal?symbol=BTCUSDT&timeframe=1h&exchange=binance"
```

**Response:**
```json
{
  "signal": "BUY",
  "score": 0.65,
  "strength_percent": 65,
  "details": {
    "trend": "UPTREND",
    "momentum": "BULLISH",
    "strength": "STRONG",
    "structure": "BULLISH_STRUCTURE"
  },
  "symbol": "BTCUSDT",
  "timeframe": "1h",
  "exchange": "binance",
  "timestamp": "2024-11-15T10:30:00"
}
```

### POST /api/v1/signal

Same as GET but accepts JSON body.

**Example:**
```bash
curl -X POST "http://localhost:8000/api/v1/signal" \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "BTCUSDT",
    "timeframe": "1h",
    "exchange": "binance"
  }'
```

## Testing

Run tests:
```bash
pytest tests/
```

## API Documentation

Visit `http://localhost:8000/docs` for interactive API documentation.

## Project Structure

```
market_signal_service/
├── app.py                      # Main application entry point
├── api/                        # API layer
│   ├── routes/                 # Route definitions
│   ├── controllers/            # Request handlers
│   └── schemas/                # Request/response models
├── domain/                     # Business logic
│   ├── services/               # Domain services
│   ├── engine/                 # Signal generation engine
│   │   ├── indicators/         # Technical indicators
│   │   ├── detectors/          # Market state detectors
│   │   ├── scoring/            # Scoring engine
│   │   └── decision/           # Decision engine
│   └── models/                 # Domain models
├── infrastructure/             # External integrations
│   ├── market_data/            # Exchange clients
│   ├── cache/                  # Caching service
│   ├── config/                 # Configuration
│   └── logging/                # Logging setup
├── core/                       # Core utilities
│   ├── timeframes.py
│   ├── thresholds.py
│   ├── normalize.py
│   ├── exceptions.py
│   └── utils.py
└── tests/                      # Tests
```

## Signal Logic

The service calculates signals using a weighted scoring system:

- **Trend (35%)**: MA/EMA analysis → UPTREND/DOWNTREND/SIDEWAYS
- **Momentum (30%)**: RSI/MACD/Stochastic → BULLISH/BEARISH/NEUTRAL
- **Strength (20%)**: ADX → STRONG/MODERATE/WEAK
- **Structure (15%)**: Higher Highs/Lower Lows → BULLISH_STRUCTURE/BEARISH_STRUCTURE/CHOPPY

Final score: -1.0 to +1.0
- Score ≥ 0.3 → BUY
- Score ≤ -0.3 → SELL
- Otherwise → HOLD

## License

MIT
