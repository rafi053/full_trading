import os
from typing import Optional
from dotenv import load_dotenv

def load_environment():
    load_dotenv()

def get_env(key: str, default: Optional[str] = None) -> Optional[str]:
    return os.getenv(key, default)

def get_env_bool(key: str, default: bool = False) -> bool:
    value = os.getenv(key, str(default))
    return value.lower() in ('true', '1', 'yes', 'on')

def get_env_int(key: str, default: int = 0) -> int:
    value = os.getenv(key, str(default))
    try:
        return int(value)
    except ValueError:
        return default
