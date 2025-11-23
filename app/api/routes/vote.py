from app.api.dependencies import get_vote_manager, get_user_manager
from fastapi import APIRouter, Depends, Request
from app.api.repository.vote_manager import VoteManager
from app.api.repository.user_manager import UserManager
from app.core.security import oauth2_scheme
from app.api.schemas.vote import VoteOut


vote_router = APIRouter(dependencies=[Depends(oauth2_scheme)])


@vote_router.get("/{product_id}/vote", response_model=VoteOut)
async def get_votes(
    token,
    product_id: int,
    request: Request,
    vote_manager: VoteManager = Depends(get_vote_manager),
    user_manager: UserManager = Depends(get_user_manager),
):
    """Return the current user's vote"""
    user = user_manager.get_user_by_email(request.state.user)
    return vote_manager.get_vote_from_current_user(token, product_id, user)


@vote_router.post("/{product_id}/vote")
async def add_vote(
    token,
    product_id: int,
    request: Request,
    vote_manager: VoteManager = Depends(get_vote_manager),
    user_manager: UserManager = Depends(get_user_manager),
):
    """Add a vote to the selected product"""
    user = user_manager.get_user_by_email(request.state.user)
    return vote_manager.add_vote(token, product_id, user)


@vote_router.delete("/{product_id}/vote")
async def delete_vote(
    token,
    product_id: int,
    request: Request,
    vote_manager: VoteManager = Depends(get_vote_manager),
    user_manager: UserManager = Depends(get_user_manager),
):
    """Delete a vote from the selected product"""
    user = user_manager.get_user_by_email(request.state.user)
    return vote_manager.delete_vote(token, product_id, user)
