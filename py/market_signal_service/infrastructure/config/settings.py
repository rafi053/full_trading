from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    APP_NAME: str = "Market Signal Service"
    VERSION: str = "1.0.0"
    
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    LOG_LEVEL: str = "INFO"
    
    CACHE_ENABLED: bool = True
    CACHE_TTL: int = 60
    
    DEFAULT_LIMIT: int = 300
    DEFAULT_EXCHANGE: str = "binance"
    DEFAULT_TIMEFRAME: str = "1h"
    
    BINANCE_API_KEY: Optional[str] = None
    BYBIT_API_KEY: Optional[str] = None
    KUCOIN_API_KEY: Optional[str] = None
    
    class Config:
        env_file = ".env"
        case_sensitive = True

_settings = None

def get_settings() -> Settings:
    global _settings
    if _settings is None:
        _settings = Settings()
    return _settings
