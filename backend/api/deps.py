from fastapi import Header, HTTPException
from typing import Optional
import logging

logger = logging.getLogger(__name__)


async def get_current_user_id(x_clerk_user_id: Optional[str] = Header(None)) -> str:
    """
    Extract Clerk user ID from request header.
    In production, verify the JWT token with Clerk's SDK.
    """
    if not x_clerk_user_id:
        raise HTTPException(status_code=401, detail="Missing authentication header")
    return x_clerk_user_id
