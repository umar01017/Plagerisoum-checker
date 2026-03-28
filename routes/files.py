from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
import io
import pdfplumber
import docx
from models.user import UserResponse
from routes.deps import get_current_user

router = APIRouter()

@router.post("/upload")
async def upload_document(file: UploadFile = File(...), current_user: UserResponse = Depends(get_current_user)):
    ext = file.filename.split(".")[-1].lower()
    
    if ext not in ["txt", "pdf", "docx"]:
        raise HTTPException(status_code=400, detail="Unsupported file type. Use txt, pdf, or docx.")
        
    content = await file.read()
    text = ""
    
    try:
        if ext == "txt":
            text = content.decode("utf-8", errors="ignore")
        elif ext == "pdf":
            with pdfplumber.open(io.BytesIO(content)) as pdf:
                for page in pdf.pages:
                    extracted = page.extract_text()
                    if extracted:
                        text += extracted + "\n"
        elif ext == "docx":
            doc = docx.Document(io.BytesIO(content))
            for para in doc.paragraphs:
                text += para.text + "\n"
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing file: {str(e)}")
        
    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from file or file is empty.")
        
    return {"filename": file.filename, "extracted_text": text.strip()}
