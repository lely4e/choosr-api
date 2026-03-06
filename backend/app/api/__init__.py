from fastapi import APIRouter
from app.api.routes.auth import auth_router
from app.api.routes.user import user_router
from app.api.routes.poll import poll_router
from app.api.routes.product import product_router
from app.api.routes.vote import vote_router
from app.api.routes.comments import comment_router
from app.api.routes.search import search_router
from app.api.routes.suggestion import suggestion_router
from app.api.routes.activity import activity_router

router = APIRouter()
router.include_router(auth_router, tags=["Authentication"])
router.include_router(user_router, prefix="/me", tags=["User"])
router.include_router(search_router, tags=["Search Products"])
router.include_router(suggestion_router, tags=["Suggestions"])
router.include_router(activity_router, tags=["Activities"])
router.include_router(poll_router, prefix="/polls", tags=["Polls"])

router.include_router(vote_router, prefix="/polls/{uuid}/products", tags=["Votes"])
router.include_router(
    comment_router, prefix="/polls/{uuid}/products", tags=["Comments"]
)
router.include_router(product_router, prefix="/polls/{uuid}", tags=["Products"])
