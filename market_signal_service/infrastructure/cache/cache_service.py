from typing import Any, Optional
import time
from market_signal_service.infrastructure.logging.logger import get_logger

logger = get_logger(__name__)

class CacheService:
    def __init__(self):
        self._cache = {}
        self._timestamps = {}
    
    def get(self, key: str) -> Optional[Any]:
        if key not in self._cache:
            return None
        
        if key in self._timestamps:
            timestamp, ttl = self._timestamps[key]
            if time.time() - timestamp > ttl:
                logger.debug(f"Cache expired for key: {key}")
                self.delete(key)
                return None
        
        logger.debug(f"Cache hit for key: {key}")
        return self._cache[key]
    
    def set(self, key: str, value: Any, ttl: int = 60) -> None:
        self._cache[key] = value
        self._timestamps[key] = (time.time(), ttl)
        logger.debug(f"Cache set for key: {key} with TTL: {ttl}s")
    
    def delete(self, key: str) -> None:
        if key in self._cache:
            del self._cache[key]
        if key in self._timestamps:
            del self._timestamps[key]
        logger.debug(f"Cache deleted for key: {key}")
    
    def clear(self) -> None:
        self._cache.clear()
        self._timestamps.clear()
        logger.info("Cache cleared")
    
    def exists(self, key: str) -> bool:
        return self.get(key) is not None
