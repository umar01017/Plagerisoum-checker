from pydantic import BaseModel, Field
from datetime import datetime, timezone
from typing import Optional

class UploadedDocument(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    user_id: str
    filename: str
    content: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
