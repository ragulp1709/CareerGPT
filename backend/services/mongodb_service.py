from database import get_database
from models.schemas import UserProfile, UserProfileUpdate
from datetime import datetime
from bson import ObjectId
from typing import Optional
import logging

logger = logging.getLogger(__name__)


async def get_user_by_clerk_id(clerk_id: str) -> Optional[dict]:
    db = get_database()
    return await db.users.find_one({"clerk_id": clerk_id})


async def create_or_update_user(profile: UserProfile) -> dict:
    db = get_database()
    existing = await get_user_by_clerk_id(profile.clerk_id)
    data = profile.model_dump()
    data["updated_at"] = datetime.utcnow()
    if existing:
        await db.users.update_one({"clerk_id": profile.clerk_id}, {"$set": data})
        return {**existing, **data}
    result = await db.users.insert_one(data)
    data["_id"] = str(result.inserted_id)
    return data


async def update_user_profile(clerk_id: str, update: UserProfileUpdate) -> Optional[dict]:
    db = get_database()
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    result = await db.users.find_one_and_update(
        {"clerk_id": clerk_id},
        {"$set": update_data},
        return_document=True,
    )
    return result


async def save_career_recommendation(clerk_id: str, recommendation: dict):
    db = get_database()
    await db.careers.insert_one({"clerk_id": clerk_id, **recommendation, "created_at": datetime.utcnow()})


async def save_roadmap(clerk_id: str, roadmap: dict):
    db = get_database()
    await db.roadmaps.replace_one(
        {"clerk_id": clerk_id},
        {"clerk_id": clerk_id, **roadmap, "updated_at": datetime.utcnow()},
        upsert=True,
    )


async def get_roadmap(clerk_id: str) -> Optional[dict]:
    db = get_database()
    return await db.roadmaps.find_one({"clerk_id": clerk_id})


async def save_resume_analysis(clerk_id: str, analysis: dict):
    db = get_database()
    await db.resumes.replace_one(
        {"clerk_id": clerk_id},
        {"clerk_id": clerk_id, **analysis, "updated_at": datetime.utcnow()},
        upsert=True,
    )


async def get_chat_history(clerk_id: str, limit: int = 50) -> list:
    db = get_database()
    cursor = db.chat_history.find({"clerk_id": clerk_id}).sort("timestamp", -1).limit(limit)
    return await cursor.to_list(length=limit)


async def save_chat_message(clerk_id: str, role: str, content: str):
    db = get_database()
    from datetime import datetime
    await db.chat_history.insert_one({
        "clerk_id": clerk_id,
        "role": role,
        "content": content,
        "timestamp": datetime.utcnow(),
    })


async def get_analytics() -> dict:
    db = get_database()
    users_count = await db.users.count_documents({})
    resumes_count = await db.resumes.count_documents({})
    chats_count = await db.chat_history.count_documents({})
    return {
        "total_users": users_count,
        "resumes_analyzed": resumes_count,
        "chat_messages": chats_count,
    }
