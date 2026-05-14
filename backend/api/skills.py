from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from agents.skill_agent import skill_agent_node
from services.mongodb_service import get_user_by_clerk_id
from api.deps import get_current_user_id

router = APIRouter(prefix="/skills", tags=["Skills"])


class SkillRequest(BaseModel):
    message: str = "Analyze my skill gaps"
    target_career: Optional[str] = None


@router.post("/gap-analysis")
async def analyze_skill_gap(
    request: SkillRequest,
    clerk_id: str = Depends(get_current_user_id),
):
    user = await get_user_by_clerk_id(clerk_id)
    if not user:
        raise HTTPException(status_code=404, detail="User profile not found")

    if request.target_career:
        user = {**user, "preferred_domain": request.target_career}

    from langchain_core.messages import HumanMessage
    state = {
        "messages": [HumanMessage(content=request.message)],
        "user_profile": user,
        "intent": "skill",
        "agent_output": None,
        "next_agent": "skill",
    }
    result = await skill_agent_node(state)
    return result.get("agent_output", {})
