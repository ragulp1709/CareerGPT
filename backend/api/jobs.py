from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from agents.job_agent import job_agent_node
from agents.project_agent import project_agent_node
from services.mongodb_service import get_user_by_clerk_id
from api.deps import get_current_user_id

router = APIRouter(prefix="/jobs", tags=["Jobs"])


class JobRequest(BaseModel):
    message: str = "Find jobs matching my profile"


class ProjectRequest(BaseModel):
    message: str = "Suggest portfolio projects"


@router.post("/match")
async def match_jobs(
    request: JobRequest,
    clerk_id: str = Depends(get_current_user_id),
):
    user = await get_user_by_clerk_id(clerk_id)
    if not user:
        raise HTTPException(status_code=404, detail="User profile not found")

    from langchain_core.messages import HumanMessage
    state = {
        "messages": [HumanMessage(content=request.message)],
        "user_profile": user,
        "intent": "job",
        "agent_output": None,
        "next_agent": "job",
    }
    result = await job_agent_node(state)
    return result.get("agent_output", {})


@router.post("/projects")
async def suggest_projects(
    request: ProjectRequest,
    clerk_id: str = Depends(get_current_user_id),
):
    user = await get_user_by_clerk_id(clerk_id)
    if not user:
        raise HTTPException(status_code=404, detail="User profile not found")

    from langchain_core.messages import HumanMessage
    state = {
        "messages": [HumanMessage(content=request.message)],
        "user_profile": user,
        "intent": "project",
        "agent_output": None,
        "next_agent": "project",
    }
    result = await project_agent_node(state)
    return result.get("agent_output", {})
