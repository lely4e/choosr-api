from fastapi import APIRouter
from app.api.routes.auth import auth_router
from app.api.routes.user import user_router
from app.api.routes.poll import poll_router
from app.api.routes.product import product_router
from app.api.routes.vote import vote_router
from app.api.routes.comments import comment_router

router = APIRouter()
router.include_router(auth_router, tags=["Authentication"])
router.include_router(user_router, prefix="/me", tags=["User"])
router.include_router(poll_router, tags=["Polls"])
router.include_router(vote_router, prefix="/{token}/products", tags=["Votes"])
router.include_router(comment_router, prefix="/{token}/products", tags=["Comments"])
router.include_router(product_router, prefix="/{token}", tags=["Products"])
