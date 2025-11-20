from datetime import datetime, timedelta
from typing import Optional
import pandas as pd

def round_number(value: float, decimals: int = 2) -> float:
    return round(value, decimals)

def format_timestamp(timestamp: datetime) -> str:
    return timestamp.strftime('%Y-%m-%d %H:%M:%S')

def get_utc_now() -> datetime:
    return datetime.utcnow()

def calculate_percentage_change(old_value: float, new_value: float) -> float:
    if old_value == 0:
        return 0.0
    return ((new_value - old_value) / old_value) * 100

def ensure_dataframe_columns(df: pd.DataFrame, required_columns: list) -> bool:
    return all(col in df.columns for col in required_columns)

def safe_divide(numerator: float, denominator: float, default: float = 0.0) -> float:
    if denominator == 0:
        return default
    return numerator / denominator
