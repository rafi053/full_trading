def calculate_percentage_change(old_price: float, new_price: float) -> float:
    if old_price <= 0:
        return 0.0
    return (new_price - old_price) / old_price

def detect_dip(current_price: float, prev_price: float, threshold: float) -> tuple[bool, float]:
    drop = (prev_price - current_price) / prev_price if prev_price > 0 else 0.0
    
    is_dip = drop >= threshold
    
    return is_dip, drop

def detect_rip(current_price: float, prev_price: float, threshold: float) -> tuple[bool, float]:
    rise = (current_price - prev_price) / prev_price if prev_price > 0 else 0.0
    
    is_rip = rise >= threshold
    
    return is_rip, rise

def calculate_atr(prices: list, period: int = 14) -> float:
    if len(prices) < period + 1:
        return 0.0
    
    true_ranges = []
    for i in range(1, len(prices)):
        high = max(prices[i], prices[i-1])
        low = min(prices[i], prices[i-1])
        tr = high - low
        true_ranges.append(tr)
    
    if len(true_ranges) < period:
        return 0.0
    
    atr = sum(true_ranges[-period:]) / period
    return atr

def detect_dip_with_atr(
    current_price: float,
    prev_price: float,
    atr: float,
    k_factor: float
) -> tuple[bool, float]:
    price_drop = prev_price - current_price
    
    threshold = k_factor * atr
    
    is_dip = price_drop >= threshold
    
    return is_dip, price_drop

def detect_rip_with_atr(
    current_price: float,
    prev_price: float,
    atr: float,
    k_factor: float
) -> tuple[bool, float]:
    price_rise = current_price - prev_price
    
    threshold = k_factor * atr
    
    is_rip = price_rise >= threshold
    
    return is_rip, price_rise
