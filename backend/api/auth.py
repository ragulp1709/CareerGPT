from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import get_database
import hashlib
import hmac
import os

router = APIRouter(prefix="/auth", tags=["Auth"])

SECRET = os.environ.get("SECRET_KEY", "dev-secret-key-change-in-production").encode()


def hashPassword(password: str) -> str:
    return hmac.new(SECRET, password.encode(), hashlib.sha256).hexdigest()


def verifyPassword(password: str, storedHash: str) -> bool:
    return hmac.compare_digest(hashPassword(password), storedHash)


class SignUpRequest(BaseModel):
    name: str
    email: str
    password: str


class SignInRequest(BaseModel):
    email: str
    password: str


@router.post("/signup")
async def signup(body: SignUpRequest):
    db = get_database()
    existingUser = await db.users.find_one({"email": body.email.strip().lower()})
    if existingUser:
        raise HTTPException(status_code=409, detail="An account with this email already exists.")

    userId = body.email.strip().lower().replace("@", "_").replace(".", "_")
    passwordHash = hashPassword(body.password)

    userDoc = {
        "clerk_id": userId,
        "email": body.email.strip().lower(),
        "name": body.name.strip(),
        "password_hash": passwordHash,
        "skills": [],
        "interests": [],
        "experience_level": "beginner",
    }
    await db.users.insert_one(userDoc)
    return {"clerk_id": userId, "name": body.name.strip(), "email": body.email.strip().lower()}


@router.post("/signin")
async def signin(body: SignInRequest):
    db = get_database()
    user = await db.users.find_one({"email": body.email.strip().lower()})
    if not user:
        raise HTTPException(status_code=401, detail="No account found with this email.")

    if not user.get("password_hash"):
        raise HTTPException(status_code=401, detail="Invalid credentials.")

    if not verifyPassword(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Incorrect password.")

    return {
        "clerk_id": user["clerk_id"],
        "name": user["name"],
        "email": user["email"],
    }
