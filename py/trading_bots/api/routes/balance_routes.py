from fastapi import APIRouter, HTTPException
from trading_bots.domain.services.balance_service import BalanceService


router = APIRouter()

@router.get("/balances")
async def get_balances():
    try:
        balance_service = BalanceService()
        balances = balance_service.get_all_balances()
        return {
            "success": True,
            "data": balances
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/balances/bitunix")
async def get_bitunix_balance():
    try:
        balance_service = BalanceService()
        balances = balance_service.get_bitunix_balance()
        return {
            "success": True,
            "data": balances
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))