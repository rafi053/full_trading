import pandas as pd
from datetime import datetime
from domain.engine.detectors.trend_detector import TrendDetector
from domain.engine.detectors.momentum_detector import MomentumDetector
from domain.engine.detectors.strength_detector import StrengthDetector
from domain.engine.detectors.structure_detector import StructureDetector
from domain.engine.scoring.scoring_engine import ScoringEngine
from domain.models.signal_result import SignalResult
from core.normalize import score_to_signal, score_to_strength_percent
from core.thresholds import BUY_THRESHOLD, SELL_THRESHOLD

class DecisionEngine:
    def __init__(self):
        self.trend_detector = TrendDetector()
        self.momentum_detector = MomentumDetector()
        self.strength_detector = StrengthDetector()
        self.structure_detector = StructureDetector()
        self.scoring_engine = ScoringEngine()
    
    def analyze(
        self, 
        ohlcv_data: pd.DataFrame, 
        symbol: str, 
        timeframe: str, 
        exchange: str
    ) -> SignalResult:
        trend = self.trend_detector.detect(ohlcv_data)
        momentum = self.momentum_detector.detect(ohlcv_data)
        strength = self.strength_detector.detect(ohlcv_data)
        structure = self.structure_detector.detect(ohlcv_data)
        
        score = self.scoring_engine.calculate_score(trend, momentum, strength, structure)
        
        signal = score_to_signal(score, BUY_THRESHOLD, SELL_THRESHOLD)
        strength_percent = score_to_strength_percent(score)
        
        trend_info = self.trend_detector.get_trend_info(ohlcv_data)
        momentum_info = self.momentum_detector.get_momentum_info(ohlcv_data)
        strength_info = self.strength_detector.get_strength_info(ohlcv_data)
        structure_info = self.structure_detector.get_structure_info(ohlcv_data)
        
        indicators = {
            'trend_details': trend_info,
            'momentum_details': momentum_info,
            'strength_details': strength_info,
            'structure_details': structure_info,
            'score_breakdown': self.scoring_engine.get_score_breakdown(trend, momentum, strength, structure)
        }
        
        return SignalResult(
            signal=signal,
            score=score,
            strength_percent=strength_percent,
            trend=trend,
            momentum=momentum,
            strength=strength,
            structure=structure,
            symbol=symbol,
            timeframe=timeframe,
            exchange=exchange,
            timestamp=datetime.utcnow(),
            indicators=indicators
        )
