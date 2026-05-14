from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from agents.resume_agent import resume_agent_node
from services.mongodb_service import get_user_by_clerk_id, save_resume_analysis
from api.deps import get_current_user_id
import pypdf
import io
import logging

router = APIRouter(prefix="/resume", tags=["Resume"])
logger = logging.getLogger(__name__)


def extract_text_from_pdf(file_bytes: bytes) -> str:
    reader = pypdf.PdfReader(io.BytesIO(file_bytes))
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text.strip()


@router.post("/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    clerk_id: str = Depends(get_current_user_id),
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:  # 5MB limit
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 5MB")

    resume_text = extract_text_from_pdf(contents)
    if not resume_text:
        raise HTTPException(status_code=422, detail="Could not extract text from PDF")

    user = await get_user_by_clerk_id(clerk_id) or {}

    from langchain_core.messages import HumanMessage
    state = {
        "messages": [HumanMessage(content=resume_text)],
        "user_profile": user,
        "intent": "resume",
        "agent_output": None,
        "next_agent": "resume",
    }
    result = await resume_agent_node(state)
    output = result.get("agent_output", {})
    await save_resume_analysis(clerk_id, output)
    return output


@router.get("/latest")
async def get_latest_resume(clerk_id: str = Depends(get_current_user_id)):
    from database import get_database
    db = get_database()
    doc = await db.resumes.find_one({"clerk_id": clerk_id})
    if not doc:
        raise HTTPException(status_code=404, detail="No resume analysis found")
    doc["_id"] = str(doc["_id"])
    return doc
