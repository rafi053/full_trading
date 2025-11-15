from typing import Dict

class ScoringEngine:
    WEIGHTS = {
        'trend': 0.35,
        'momentum': 0.30,
        'strength': 0.20,
        'structure': 0.15
    }
    
    TREND_SCORES = {
        'UPTREND': 1.0,
        'DOWNTREND': -1.0,
        'SIDEWAYS': 0.0
    }
    
    MOMENTUM_SCORES = {
        'BULLISH': 1.0,
        'BEARISH': -1.0,
        'NEUTRAL': 0.0
    }
    
    STRENGTH_SCORES = {
        'STRONG': 1.0,
        'MODERATE': 0.5,
        'WEAK': 0.25,
        'NONE': 0.0
    }
    
    STRUCTURE_SCORES = {
        'BULLISH_STRUCTURE': 1.0,
        'BEARISH_STRUCTURE': -1.0,
        'CHOPPY': 0.0
    }
    
    @staticmethod
    def calculate_score(trend: str, momentum: str, strength: str, structure: str) -> float:
        trend_score = ScoringEngine.TREND_SCORES.get(trend, 0.0)
        momentum_score = ScoringEngine.MOMENTUM_SCORES.get(momentum, 0.0)
        strength_score = ScoringEngine.STRENGTH_SCORES.get(strength, 0.0)
        structure_score = ScoringEngine.STRUCTURE_SCORES.get(structure, 0.0)
        
        if trend_score < 0 or momentum_score < 0 or structure_score < 0:
            strength_multiplier = strength_score
        else:
            strength_multiplier = strength_score
        
        base_score = (
            trend_score * ScoringEngine.WEIGHTS['trend'] +
            momentum_score * ScoringEngine.WEIGHTS['momentum'] +
            structure_score * ScoringEngine.WEIGHTS['structure']
        )
        
        final_score = base_score * (1 + strength_multiplier * ScoringEngine.WEIGHTS['strength'])
        
        final_score = max(-1.0, min(1.0, final_score))
        
        return round(final_score, 3)
    
    @staticmethod
    def get_score_breakdown(trend: str, momentum: str, strength: str, structure: str) -> Dict[str, float]:
        return {
            'trend_contribution': ScoringEngine.TREND_SCORES.get(trend, 0.0) * ScoringEngine.WEIGHTS['trend'],
            'momentum_contribution': ScoringEngine.MOMENTUM_SCORES.get(momentum, 0.0) * ScoringEngine.WEIGHTS['momentum'],
            'strength_contribution': ScoringEngine.STRENGTH_SCORES.get(strength, 0.0) * ScoringEngine.WEIGHTS['strength'],
            'structure_contribution': ScoringEngine.STRUCTURE_SCORES.get(structure, 0.0) * ScoringEngine.WEIGHTS['structure']
        }
