from motor.motor_asyncio import AsyncIOMotorClient
import os

client: AsyncIOMotorClient = None
db = None

async def connect_to_mongo():
    global client, db
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    db_name = os.getenv("MONGO_DB_NAME", "originalityai")
    client = AsyncIOMotorClient(mongo_uri)
    db = client[db_name]
    print(f"Connected to MongoDB (Database: {db_name})")

async def close_mongo_connection():
    global client
    if client:
        client.close()
        print("Closed MongoDB connection")
