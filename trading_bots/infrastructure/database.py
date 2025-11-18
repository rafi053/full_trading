import os
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv('MONGO_URI')

if not MONGO_URI:
    raise ValueError("MONGO_URI must be set in .env file")

async_client = AsyncIOMotorClient(MONGO_URI)
async_db = async_client.get_database("crypto-dashboard")

sync_client = MongoClient(MONGO_URI)
sync_db = sync_client.get_database("crypto-dashboard")

def get_async_db():
    return async_db

def get_sync_db():
    return sync_db

async def close_db():
    async_client.close()
    sync_client.close()