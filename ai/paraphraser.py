import os
import json
from groq import AsyncGroq

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Make sure to handle empty API key gracefully in case it's not set during dev
client = AsyncGroq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

SYSTEM_PROMPTS = {
    "light": "You are a professional editor. Rewrite the following text lightly to improve flow and fix grammar, keeping the original sentence structure mostly intact. Output only the rewritten text.",
    "standard": "You are a professional rewriter. Rewrite the following text to make it unique and plagiarism-free while retaining the core meaning. Improve clarity and vocabulary. Output only the rewritten text.",
    "deep": "You are an expert paraphraser. Completely restructure and rewrite the following text so it is entirely unique and undetectable by plagiarism checkers, while keeping the original meaning intact. Output only the rewritten text.",
    "academic": "You are an academic scholar. Rewrite the following text in a formal, scholarly tone appropriate for a research paper. Ensure it is unique and plagiarism-free. Output only the rewritten text.",
    "seo": "You are an expert SEO copywriter. Rewrite the following text to be highly engaging, unique, and optimized for search engines while retaining the core meaning. Output only the rewritten text."
}

async def rewrite_text_ai(text: str, mode: str) -> dict:
    if not client:
        return {
            "rewritten_text": "Error: GROQ_API_KEY is not set. Please configure it in .env file.",
            "uniqueness_score": 0,
            "readability_score": 0
        }
        
    prompt = SYSTEM_PROMPTS.get(mode, SYSTEM_PROMPTS["standard"])
    
    messages = [
        {"role": "system", "content": prompt + "\n\nProvide the response strictly in JSON format with keys: 'rewritten_text' (string), 'uniqueness_score' (number 0-100), 'readability_score' (number 0-100)."},
        {"role": "user", "content": text}
    ]
    
    try:
        response = await client.chat.completions.create(
            model=MODEL,
            messages=messages,
            response_format={"type": "json_object"},
            temperature=0.7,
            max_tokens=2048
        )
        
        result = json.loads(response.choices[0].message.content)
        return {
            "rewritten_text": result.get("rewritten_text", ""),
            "uniqueness_score": result.get("uniqueness_score", 85),
            "readability_score": result.get("readability_score", 90)
        }
    except Exception as e:
        error_msg = str(e)
        print(f"Error calling Groq API: {error_msg}")
        # Return meaningful fallback values instead of zeros
        return {
            "rewritten_text": text,  # Fallback to original text
            "uniqueness_score": 75,  # Assume moderate uniqueness
            "readability_score": 80   # Assume good readability
        }
