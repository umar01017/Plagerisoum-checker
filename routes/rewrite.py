from fastapi import APIRouter, Depends, HTTPException, status
from models.user import UserResponse
from models.history import RewriteRequest, RewriteResponse, RewriteHistory
from routes.deps import get_current_user
from ai.paraphraser import rewrite_text_ai
from ai.detector import detect_plagiarism
from database.mongodb import db
from pydantic import BaseModel

class DetectRequest(BaseModel):
    text: str

class DetectResponse(BaseModel):
    plagiarism_score: float
    ai_generated_score: float
    details: str

router = APIRouter()

@router.post("/", response_model=RewriteResponse)
async def rewrite_text(req: RewriteRequest, current_user: UserResponse = Depends(get_current_user)):
    from database.mongodb import db
    
    # Call AI Paraphraser
    ai_result = await rewrite_text_ai(req.text, req.mode)
    
    try:
        score_after = 100 - float(ai_result["uniqueness_score"])
    except:
        score_after = 25
        
    # Save to history if database is available
    try:
        if db is not None:
            history_record = RewriteHistory(
                user_id=current_user.id,
                original_text=req.text,
                rewritten_text=ai_result["rewritten_text"],
                mode=req.mode,
                plagiarism_score_before=0,
                plagiarism_score_after=score_after
            )
            await db.history.insert_one(history_record.model_dump(by_alias=True, exclude_none=True))
    except Exception as e:
        print(f"Error saving history: {str(e)}")
        # Continue anyway, history save is not critical
    
    return RewriteResponse(
        rewritten_text=ai_result["rewritten_text"],
        uniqueness_score=float(ai_result.get("uniqueness_score", 75)),
        readability_score=float(ai_result.get("readability_score", 80))
    )
    
@router.get("/history")
async def get_history(current_user: UserResponse = Depends(get_current_user)):
    cursor = db.history.find({"user_id": current_user.id}).sort("created_at", -1)
    history_list = await cursor.to_list(length=50)
    for h in history_list:
        h["id"] = str(h["_id"])
        del h["_id"]
    return history_list

@router.post("/detect", response_model=DetectResponse)
async def detect_text_plagiarism(req: DetectRequest, current_user: UserResponse = Depends(get_current_user)):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Text is empty")
    try:
        result = await detect_plagiarism(req.text)
        return {
            "plagiarism_score": float(result.get("plagiarism_score", 0)),
            "ai_generated_score": float(result.get("ai_generated_score", 0)),
            "details": str(result.get("details", "Analysis complete"))
        }
    except Exception as e:
        print(f"Detect endpoint error: {str(e)}")
        return {
            "plagiarism_score": 0.0,
            "ai_generated_score": 0.0,
            "details": f"Error: {str(e)[:100]}"
        }

