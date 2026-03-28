from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from contextlib import asynccontextmanager
import os
from database.mongodb import connect_to_mongo, close_mongo_connection
from routes.auth import router as auth_router
from routes.rewrite import router as rewrite_router
from routes.files import router as files_router

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()

app = FastAPI(title="OriginalityAI API", description="AI powered plagiarism removal and paraphrasing API", lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(rewrite_router, prefix="/api/rewrite", tags=["rewrite"])
app.include_router(files_router, prefix="/api/files", tags=["files"])

@app.get("/")
async def root():
    return {"message": "OriginalityAI API is running"}
