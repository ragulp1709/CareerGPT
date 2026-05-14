from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from agents.orchestrator import run_agent
from agents.career_agent import career_agent_node
from services.mongodb_service import get_user_by_clerk_id, save_career_recommendation
from api.deps import get_current_user_id

router = APIRouter(prefix="/career", tags=["Career"])


class CareerRequest(BaseModel):
    message: str = "Recommend the best career paths for me"


@router.post("/recommend")
async def recommend_careers(
    request: CareerRequest,
    clerk_id: str = Depends(get_current_user_id),
):
    user = await get_user_by_clerk_id(clerk_id)
    if not user:
        raise HTTPException(status_code=404, detail="User profile not found. Please complete your profile.")

    from langchain_core.messages import HumanMessage, AIMessage
    state = {
        "messages": [HumanMessage(content=request.message)],
        "user_profile": user,
        "intent": "career",
        "agent_output": None,
        "next_agent": "career",
    }
    result = await career_agent_node(state)
    output = result.get("agent_output", {})

    # Persist top recommendation
    if output.get("careers"):
        await save_career_recommendation(clerk_id, {"recommendations": output["careers"]})

    return output


@router.get("/history")
async def get_career_history(clerk_id: str = Depends(get_current_user_id)):
    from database import get_database
    db = get_database()
    cursor = db.careers.find({"clerk_id": clerk_id}).sort("created_at", -1).limit(10)
    history = await cursor.to_list(length=10)
    for item in history:
        item["_id"] = str(item["_id"])
    return history
