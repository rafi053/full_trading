from fastapi import HTTPException
from api.schemas.signal_request import SignalRequest
from api.schemas.signal_response import SignalResponse
from domain.services.signal_service import SignalService
from core.exceptions import NoDataError, ExchangeError, InvalidSymbolError
from infrastructure.logging.logger import get_logger

logger = get_logger(__name__)

class SignalController:
    def __init__(self):
        self.signal_service = SignalService()
    
    async def get_signal(self, symbol: str, timeframe: str, exchange: str):
        try:
            request = SignalRequest(
                symbol=symbol,
                timeframe=timeframe,
                exchange=exchange
            )
            
            result = await self.signal_service.get_market_signal(
                symbol=request.symbol,
                timeframe=request.timeframe,
                exchange=request.exchange
            )
            
            response = SignalResponse.from_signal_result(result)
            
            return response.dict()
            
        except InvalidSymbolError as e:
            logger.error(f"Invalid symbol: {str(e)}")
            raise HTTPException(status_code=400, detail=str(e))
        except NoDataError as e:
            logger.error(f"No data available: {str(e)}")
            raise HTTPException(status_code=404, detail=str(e))
        except ExchangeError as e:
            logger.error(f"Exchange error: {str(e)}")
            raise HTTPException(status_code=503, detail=str(e))
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal server error")
    
    async def get_signal_from_request(self, request_data: dict):
        return await self.get_signal(
            symbol=request_data.get("symbol"),
            timeframe=request_data.get("timeframe", "1h"),
            exchange=request_data.get("exchange", "binance")
        )
