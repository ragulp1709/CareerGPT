from fastapi import APIRouter, HTTPException, Depends
from services.github_service import analyze_github_profile
from services.mongodb_service import get_user_by_clerk_id
from api.deps import get_current_user_id

router = APIRouter(prefix="/github", tags=["GitHub"])


@router.get("/analyze/{username}")
async def analyze_github(username: str):
    try:
        result = await analyze_github_profile(username)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"GitHub analysis failed: {str(e)}")


@router.get("/me")
async def analyze_my_github(clerk_id: str = Depends(get_current_user_id)):
    user = await get_user_by_clerk_id(clerk_id)
    if not user or not user.get("github_url"):
        raise HTTPException(status_code=400, detail="No GitHub URL in profile")

    github_url = user["github_url"]
    username = github_url.rstrip("/").split("/")[-1]

    try:
        result = await analyze_github_profile(username)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
