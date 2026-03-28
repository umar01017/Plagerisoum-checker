from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timezone

class RewriteHistory(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    user_id: str
    original_text: str
    rewritten_text: str
    mode: str
    plagiarism_score_before: Optional[float] = None
    plagiarism_score_after: Optional[float] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class RewriteRequest(BaseModel):
    text: str
    mode: str = "standard" # light, standard, deep, academic, seo

class RewriteResponse(BaseModel):
    rewritten_text: str
    uniqueness_score: float
    readability_score: float
