import threading
import uuid
from typing import Dict, Optional, List
from datetime import datetime

class BotManager:
    def __init__(self):
        self.active_bots: Dict[str, dict] = {}
        
    def start_bot(self, bot_type: str, symbol: str, config: dict) -> str:
        bot_id = str(uuid.uuid4())
        
        bot_info = {
            "id": bot_id,
            "type": bot_type,
            "symbol": symbol,
            "config": config,
            "status": "running",
            "started_at": datetime.utcnow().isoformat(),
            "thread": None,
            "bot_instance": None
        }
        
        self.active_bots[bot_id] = bot_info
        
        return bot_id
    
    def stop_bot(self, bot_id: str) -> bool:
        if bot_id not in self.active_bots:
            return False
        
        self.active_bots[bot_id]["status"] = "stopped"
        self.active_bots[bot_id]["stopped_at"] = datetime.utcnow().isoformat()
        
        return True
    
    def get_bot_status(self, bot_id: str) -> Optional[dict]:
        if bot_id not in self.active_bots:
            return None
        
        bot_info = self.active_bots[bot_id]
        return {
            "bot_id": bot_info["id"],
            "type": bot_info["type"],
            "symbol": bot_info["symbol"],
            "status": bot_info["status"],
            "started_at": bot_info.get("started_at"),
            "stopped_at": bot_info.get("stopped_at")
        }
    
    def get_all_bots(self) -> List[dict]:
        return [
            self.get_bot_status(bot_id) 
            for bot_id in self.active_bots.keys()
        ]
    
    def delete_bot(self, bot_id: str) -> bool:
        if bot_id not in self.active_bots:
            return False
        
        del self.active_bots[bot_id]
        return True