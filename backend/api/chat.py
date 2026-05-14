from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from services.ai_service import get_llm
from services.mongodb_service import (
    get_user_by_clerk_id, get_chat_history, save_chat_message
)
from rag.pipeline import rag_query
from api.deps import get_current_user_id
import logging

router = APIRouter(prefix="/chat", tags=["Chat"])
logger = logging.getLogger(__name__)

MENTOR_SYSTEM = """You are CareerGPT — an empathetic, knowledgeable AI career mentor.
You help users with career planning, skill development, job search, interview prep, and professional growth.

Key traits:
- Warm, encouraging, and motivating
- Evidence-based advice with specific examples
- Remember the user's context within the conversation
- Give actionable next steps, not just information
- Be concise but thorough

If asked about specific technologies, provide learning resources.
If asked about salary, provide realistic market data.
Always end with an encouraging note or a follow-up question."""


class ChatRequest(BaseModel):
    message: str
    use_rag: bool = True


class ChatResponse(BaseModel):
    response: str
    sources_used: bool


@router.post("/message", response_model=ChatResponse)
async def chat_message(
    request: ChatRequest,
    clerk_id: str = Depends(get_current_user_id),
):
    user = await get_user_by_clerk_id(clerk_id) or {}

    # Build conversation context from history
    history = await get_chat_history(clerk_id, limit=10)
    history.reverse()

    # Save incoming message
    await save_chat_message(clerk_id, "user", request.message)

    sources_used = False
    response_text = ""

    if request.use_rag:
        try:
            response_text = await rag_query(request.message)
            sources_used = True
        except Exception as e:
            logger.warning(f"RAG failed, falling back to direct LLM: {e}")

    if not response_text:
        llm = get_llm(temperature=0.7)
        user_context = f"\nUser profile: Skills={user.get('skills', [])}, Goal={user.get('career_goals', 'N/A')}"
        messages = [SystemMessage(content=MENTOR_SYSTEM + user_context)]

        for h in history[-6:]:
            if h["role"] == "user":
                messages.append(HumanMessage(content=h["content"]))
            else:
                messages.append(AIMessage(content=h["content"]))

        messages.append(HumanMessage(content=request.message))
        result = await llm.ainvoke(messages)
        response_text = result.content

    await save_chat_message(clerk_id, "assistant", response_text)
    return ChatResponse(response=response_text, sources_used=sources_used)


@router.get("/history")
async def get_history(
    limit: int = 50,
    clerk_id: str = Depends(get_current_user_id),
):
    history = await get_chat_history(clerk_id, limit=limit)
    history.reverse()
    for item in history:
        item["_id"] = str(item.get("_id", ""))
    return history


@router.delete("/history")
async def clear_history(clerk_id: str = Depends(get_current_user_id)):
    from database import get_database
    db = get_database()
    result = await db.chat_history.delete_many({"clerk_id": clerk_id})
    return {"deleted": result.deleted_count}
