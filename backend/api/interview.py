from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from agents.interview_agent import interview_agent_node
from services.mongodb_service import get_user_by_clerk_id
from api.deps import get_current_user_id

router = APIRouter(prefix="/interview", tags=["Interview"])


class InterviewRequest(BaseModel):
    message: str = "Generate interview questions for my target role"
    role: Optional[str] = None
    category: str = "all"  # technical, hr, behavioral, all


@router.post("/questions")
async def get_interview_questions(
    request: InterviewRequest,
    clerk_id: str = Depends(get_current_user_id),
):
    user = await get_user_by_clerk_id(clerk_id) or {}

    if request.role:
        user = {**user, "preferred_domain": request.role}

    msg = f"{request.message}. Category: {request.category}"

    from langchain_core.messages import HumanMessage
    state = {
        "messages": [HumanMessage(content=msg)],
        "user_profile": user,
        "intent": "interview",
        "agent_output": None,
        "next_agent": "interview",
    }
    result = await interview_agent_node(state)
    return result.get("agent_output", {})


class FeedbackRequest(BaseModel):
    question: str
    user_answer: str


@router.post("/feedback")
async def get_answer_feedback(
    request: FeedbackRequest,
    clerk_id: str = Depends(get_current_user_id),
):
    from services.ai_service import generate_response

    system_prompt = """You are an expert interview coach. Evaluate the candidate's answer and provide:
1. Score out of 10
2. What was good about the answer
3. What was missing or could be improved
4. A model answer for reference
5. Confidence score percentage

Be constructive and encouraging."""

    user_msg = f"Question: {request.question}\n\nCandidate's Answer: {request.user_answer}"
    feedback = await generate_response(system_prompt, user_msg)
    return {"feedback": feedback, "question": request.question}
