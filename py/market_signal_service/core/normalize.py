def score_to_signal(score: float, buy_threshold: float = 0.3, sell_threshold: float = -0.3) -> str:
    if score >= buy_threshold:
        return "BUY"
    elif score <= sell_threshold:
        return "SELL"
    else:
        return "HOLD"

def score_to_strength_percent(score: float) -> int:
    strength = int(abs(score) * 100)
    return min(100, max(0, strength))

def normalize_score(score: float) -> float:
    return max(-1.0, min(1.0, score))
