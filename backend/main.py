from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from config import settings
from database import connect_db, close_db
from api import users, career, skills, resume, chat, roadmap, interview, jobs, github, admin, auth

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting CareerGPT API...")
    await connect_db()
    yield
    await close_db()
    logger.info("CareerGPT API stopped.")


app = FastAPI(
    title="CareerGPT API",
    description="AI-powered multi-agent career guidance platform",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(users.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")
app.include_router(career.router, prefix="/api/v1")
app.include_router(skills.router, prefix="/api/v1")
app.include_router(resume.router, prefix="/api/v1")
app.include_router(chat.router, prefix="/api/v1")
app.include_router(roadmap.router, prefix="/api/v1")
app.include_router(interview.router, prefix="/api/v1")
app.include_router(jobs.router, prefix="/api/v1")
app.include_router(github.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")


@app.get("/")
async def root():
    return {
        "app": "CareerGPT API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}
