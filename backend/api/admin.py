from fastapi import APIRouter, HTTPException
from services.mongodb_service import get_analytics
from rag.pipeline import seed_career_knowledge

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/analytics")
async def get_platform_analytics():
    return await get_analytics()


@router.post("/seed-knowledge")
async def seed_knowledge_base():
    count = await seed_career_knowledge()
    return {"message": f"Seeded {count} knowledge chunks into vector DB"}
