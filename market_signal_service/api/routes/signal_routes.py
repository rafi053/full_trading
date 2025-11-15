from fastapi import APIRouter
from api.controllers.signal_controller import SignalController

router = APIRouter(tags=["signals"])

signal_controller = SignalController()

@router.get("/signal")
async def get_signal(
    symbol: str,
    timeframe: str = "1h",
    exchange: str = "binance"
):
    return await signal_controller.get_signal(symbol, timeframe, exchange)

@router.post("/signal")
async def get_signal_post(request: dict):
    return await signal_controller.get_signal_from_request(request)
