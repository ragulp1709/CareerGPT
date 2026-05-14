from fastapi import APIRouter, HTTPException, Depends
from models.schemas import UserProfile, UserProfileUpdate
from services.mongodb_service import (
    get_user_by_clerk_id, create_or_update_user, update_user_profile
)
from api.deps import get_current_user_id

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me")
async def get_profile(clerk_id: str = Depends(get_current_user_id)):
    user = await get_user_by_clerk_id(clerk_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user["_id"] = str(user.get("_id", ""))
    return user


@router.post("/me")
async def upsert_profile(profile: UserProfile):
    user = await create_or_update_user(profile)
    user["_id"] = str(user.get("_id", ""))
    return user


@router.patch("/me")
async def patch_profile(update: UserProfileUpdate, clerk_id: str = Depends(get_current_user_id)):
    user = await update_user_profile(clerk_id, update)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user["_id"] = str(user.get("_id", ""))
    return user
