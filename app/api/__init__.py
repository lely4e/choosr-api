from fastapi import APIRouter
from app.api.routes.routes_user import user_router
from app.api.routes.routes_poll import poll_router
from app.api.routes.routes_product import product_router
from app.api.routes.routes_vote import vote_router
from app.api.routes.routes_auth import auth_router

router = APIRouter()
router.include_router(user_router)  # prefix=/users
router.include_router(poll_router)
router.include_router(product_router)
router.include_router(vote_router)
router.include_router(auth_router)
