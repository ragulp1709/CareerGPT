from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from agents.learning_agent import learning_agent_node
from services.mongodb_service import get_user_by_clerk_id, save_roadmap, get_roadmap
from api.deps import get_current_user_id

router = APIRouter(prefix="/roadmap", tags=["Roadmap"])


class RoadmapRequest(BaseModel):
    message: str = "Create a personalized learning roadmap for me"
    career_path: Optional[str] = None


@router.post("/generate")
async def generate_roadmap(
    request: RoadmapRequest,
    clerk_id: str = Depends(get_current_user_id),
):
    user = await get_user_by_clerk_id(clerk_id)
    if not user:
        raise HTTPException(status_code=404, detail="User profile not found")

    if request.career_path:
        user = {**user, "preferred_domain": request.career_path}

    from langchain_core.messages import HumanMessage
    state = {
        "messages": [HumanMessage(content=request.message)],
        "user_profile": user,
        "intent": "roadmap",
        "agent_output": None,
        "next_agent": "roadmap",
    }
    result = await learning_agent_node(state)
    output = result.get("agent_output", {})
    await save_roadmap(clerk_id, output)
    return output


@router.get("/me")
async def get_my_roadmap(clerk_id: str = Depends(get_current_user_id)):
    roadmap = await get_roadmap(clerk_id)
    if not roadmap:
        raise HTTPException(status_code=404, detail="No roadmap found. Generate one first.")
    roadmap["_id"] = str(roadmap.get("_id", ""))
    return roadmap
