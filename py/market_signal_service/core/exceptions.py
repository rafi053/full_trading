class MarketSignalException(Exception):
    pass

class NoDataError(MarketSignalException):
    pass

class ExchangeError(MarketSignalException):
    pass

class InvalidSymbolError(MarketSignalException):
    pass

class InvalidTimeframeError(MarketSignalException):
    pass

class CacheError(MarketSignalException):
    pass
