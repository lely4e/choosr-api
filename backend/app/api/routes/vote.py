from app.api.dependencies import get_vote_manager, get_user_manager
from fastapi import APIRouter, Depends, Request
from app.api.repository.vote_manager import VoteManager
from app.api.repository.user_manager import UserManager
from app.core.security import oauth2_scheme
from app.api.schemas.vote import VoteOut
from uuid import UUID


vote_router = APIRouter(dependencies=[Depends(oauth2_scheme)])


@vote_router.get("/{product_id}/vote", response_model=VoteOut)
async def get_votes(
    uuid: UUID,
    product_id: int,
    request: Request,
    vote_manager: VoteManager = Depends(get_vote_manager),
    user_manager: UserManager = Depends(get_user_manager),
) -> VoteOut:
    """Return the current user's vote"""
    user = user_manager.get_user_by_email(request.state.user)
    return vote_manager.get_vote_from_current_user(uuid, product_id, user)


@vote_router.post("/{product_id}/vote")
async def add_vote(
    uuid: UUID,
    product_id: int,
    request: Request,
    vote_manager: VoteManager = Depends(get_vote_manager),
    user_manager: UserManager = Depends(get_user_manager),
):
    """Add a vote to the selected product"""
    user = user_manager.get_user_by_email(request.state.user)
    return vote_manager.add_vote(uuid, product_id, user)


@vote_router.delete("/{product_id}/vote")
async def delete_vote(
    uuid: UUID,
    product_id: int,
    request: Request,
    vote_manager: VoteManager = Depends(get_vote_manager),
    user_manager: UserManager = Depends(get_user_manager),
):
    """Delete a vote from the selected product"""
    user = user_manager.get_user_by_email(request.state.user)
    return vote_manager.delete_vote(uuid, product_id, user)
