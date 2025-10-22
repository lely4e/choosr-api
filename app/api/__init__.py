from fastapi import APIRouter
from app.api.routes_user import user_router
from app.api.routes_poll import poll_router

router = APIRouter()
router.include_router(user_router)  # prefix=/users
router.include_router(poll_router)
