VALID_TIMEFRAMES = [
    '1m', '3m', '5m', '15m', '30m',
    '1h', '2h', '4h', '6h', '8h', '12h',
    '1d', '3d', '1w', '1M'
]

TIMEFRAME_MINUTES = {
    '1m': 1,
    '3m': 3,
    '5m': 5,
    '15m': 15,
    '30m': 30,
    '1h': 60,
    '2h': 120,
    '4h': 240,
    '6h': 360,
    '8h': 480,
    '12h': 720,
    '1d': 1440,
    '3d': 4320,
    '1w': 10080,
    '1M': 43200
}

def normalize_timeframe(timeframe: str) -> str:
    timeframe = timeframe.lower().strip()
    
    if timeframe in VALID_TIMEFRAMES:
        return timeframe
    
    timeframe_map = {
        '1min': '1m',
        '3min': '3m',
        '5min': '5m',
        '15min': '15m',
        '30min': '30m',
        '1hour': '1h',
        '2hour': '2h',
        '4hour': '4h',
        '6hour': '6h',
        '8hour': '8h',
        '12hour': '12h',
        '1day': '1d',
        '3day': '3d',
        '1week': '1w',
        '1month': '1M'
    }
    
    return timeframe_map.get(timeframe, timeframe)

def get_timeframe_minutes(timeframe: str) -> int:
    normalized = normalize_timeframe(timeframe)
    return TIMEFRAME_MINUTES.get(normalized, 60)
