from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel
from trading_bots.domain.services.bot_manager import BotManager

router = APIRouter()

bot_manager = BotManager()

class StartBotRequest(BaseModel):
    bot_id: str

class BotStatusResponse(BaseModel):
    bot_id: str
    name: str
    type: str
    symbol: str
    status: str
    thread_alive: bool
    started_at: str = None
    stopped_at: str = None

@router.get("/", response_model=List[BotStatusResponse])
async def list_bots():
    try:
        bots = bot_manager.get_all_bots()
        return bots
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/start")
async def start_bot(request: StartBotRequest):
    try:
        result = bot_manager.start_bot(request.bot_id)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{bot_id}/stop")
async def stop_bot(bot_id: str):
    try:
        success = bot_manager.stop_bot(bot_id)
        if not success:
            raise HTTPException(status_code=404, detail="Bot not found")
        
        return {
            "status": "stopped",
            "bot_id": bot_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{bot_id}/status", response_model=BotStatusResponse)
async def get_bot_status(bot_id: str):
    try:
        status = bot_manager.get_bot_status(bot_id)
        if not status:
            raise HTTPException(status_code=404, detail="Bot not found")
        
        return status
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{bot_id}")
async def delete_bot(bot_id: str):
    try:
        success = bot_manager.delete_bot(bot_id)
        if not success:
            raise HTTPException(status_code=404, detail="Bot not found")
        
        return {
            "status": "deleted",
            "bot_id": bot_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))