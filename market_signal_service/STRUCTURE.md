# Market Signal Service - Project Structure

## Complete File Tree

```
market_signal_service/
│
├── app.py                                              # FastAPI application entry point
│
├── requirements.txt                                    # Python dependencies
├── .env.example                                        # Environment variables template
├── .gitignore                                          # Git ignore rules
├── README.md                                           # Project documentation
│
├── api/                                                # API Layer
│   ├── __init__.py
│   ├── routes/
│   │   ├── __init__.py
│   │   └── signal_routes.py                           # REST endpoints
│   ├── controllers/
│   │   ├── __init__.py
│   │   └── signal_controller.py                       # Request handling
│   └── schemas/
│       ├── __init__.py
│       ├── signal_request.py                          # Request validation
│       └── signal_response.py                         # Response formatting
│
├── domain/                                             # Domain/Business Logic Layer
│   ├── __init__.py
│   ├── services/
│   │   ├── __init__.py
│   │   └── signal_service.py                          # Main business service
│   ├── engine/
│   │   ├── __init__.py
│   │   ├── indicators/
│   │   │   ├── __init__.py
│   │   │   ├── ma_indicator.py                        # Moving Average
│   │   │   ├── ema_indicator.py                       # Exponential Moving Average
│   │   │   ├── rsi_indicator.py                       # Relative Strength Index
│   │   │   ├── macd_indicator.py                      # MACD
│   │   │   ├── stochastic_indicator.py                # Stochastic Oscillator
│   │   │   ├── adx_indicator.py                       # Average Directional Index
│   │   │   └── market_structure_indicator.py          # Market Structure (HH/LL)
│   │   ├── detectors/
│   │   │   ├── __init__.py
│   │   │   ├── trend_detector.py                      # Trend detection
│   │   │   ├── momentum_detector.py                   # Momentum detection
│   │   │   ├── strength_detector.py                   # Strength detection
│   │   │   └── structure_detector.py                  # Structure detection
│   │   ├── scoring/
│   │   │   ├── __init__.py
│   │   │   └── scoring_engine.py                      # Score calculation
│   │   └── decision/
│   │       ├── __init__.py
│   │       └── decision_engine.py                     # Final decision logic
│   └── models/
│       ├── __init__.py
│       └── signal_result.py                           # Domain model
│
├── infrastructure/                                     # Infrastructure Layer
│   ├── __init__.py
│   ├── market_data/
│   │   ├── __init__.py
│   │   ├── binance_client.py                          # Binance integration
│   │   ├── bybit_client.py                            # Bybit integration
│   │   ├── kucoin_client.py                           # KuCoin integration
│   │   └── market_data_service.py                     # Market data orchestration
│   ├── cache/
│   │   ├── __init__.py
│   │   └── cache_service.py                           # In-memory cache
│   ├── config/
│   │   ├── __init__.py
│   │   ├── settings.py                                # Application settings
│   │   └── env_loader.py                              # Environment loader
│   └── logging/
│       ├── __init__.py
│       └── logger.py                                  # Logging configuration
│
├── core/                                               # Core Utilities
│   ├── __init__.py
│   ├── timeframes.py                                  # Timeframe constants
│   ├── thresholds.py                                  # Threshold constants
│   ├── normalize.py                                   # Normalization functions
│   ├── exceptions.py                                  # Custom exceptions
│   └── utils.py                                       # Utility functions
│
└── tests/                                              # Tests
    ├── __init__.py
    ├── test_indicators.py                             # Indicator tests
    ├── test_decision_engine.py                        # Decision engine tests
    ├── test_signal_service.py                         # Service tests
    └── test_api.py                                    # API tests
```

## Layer Responsibilities

### API Layer
- Routes: URL mapping and endpoint definitions
- Controllers: Request/response handling, error handling
- Schemas: Input validation and output formatting

### Domain Layer
- Services: Business logic orchestration
- Engine/Indicators: Technical indicator calculations
- Engine/Detectors: Market state interpretation
- Engine/Scoring: Score calculation
- Engine/Decision: Final signal decision
- Models: Domain data structures

### Infrastructure Layer
- Market Data: Exchange API integrations
- Cache: Performance optimization
- Config: Application configuration
- Logging: Structured logging

### Core Layer
- Shared constants, utilities, and exceptions

## File Count
- Total Python files: 56
- Total directories: 19
- Main components: 40+ files

## Quick Start Commands

```bash
# Install dependencies
pip install -r requirements.txt

# Run server
python app.py

# Run tests
pytest tests/

# API documentation
http://localhost:8000/docs
```
