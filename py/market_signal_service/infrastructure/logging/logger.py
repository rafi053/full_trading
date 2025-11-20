import logging
import sys
from typing import Optional

_logger_instance: Optional[logging.Logger] = None

def setup_logger(name: str = "market_signal_service", level: str = "INFO") -> logging.Logger:
    global _logger_instance
    
    if _logger_instance is not None:
        return _logger_instance
    
    logger = logging.getLogger(name)
    logger.setLevel(getattr(logging, level.upper()))
    
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setLevel(getattr(logging, level.upper()))
        
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        handler.setFormatter(formatter)
        
        logger.addHandler(handler)
    
    _logger_instance = logger
    return logger

def get_logger(name: str = None) -> logging.Logger:
    if name:
        return logging.getLogger(f"market_signal_service.{name}")
    return logging.getLogger("market_signal_service")
