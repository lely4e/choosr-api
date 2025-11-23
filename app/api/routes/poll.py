from app.api.schemas.poll import PollRead, PollResponse
from typing import List
from app.api.dependencies import get_user_manager, get_poll_manager
from fastapi import APIRouter, Depends, Request
from app.api.repository.user_manager import UserManager
from app.api.repository.poll_manager import PollManager
from app.core.security import oauth2_scheme


poll_router = APIRouter(dependencies=[Depends(oauth2_scheme)])


# # get all polls
# @poll_router.get("/polls")
# async def read_polls(poll_manager: PollManager = Depends(get_poll_manager)):
#     polls = poll_manager.get_polls()
#     return [dict(row._mapping) for row in polls]


@poll_router.get("/polls", response_model=List[PollResponse])  #
async def read_own_items(
    request: Request,
    poll_manager: PollManager = Depends(get_poll_manager),
    user_manager: UserManager = Depends(get_user_manager),
):
    """Retrieve polls from the current user"""
    user = user_manager.get_user_by_email(request.state.user)
    return poll_manager.get_polls_by_user_id(user_id=user.id)


@poll_router.post("/polls", response_model=PollResponse)
async def create_poll(
    request: Request,
    poll_in: PollRead,
    poll_manager: PollManager = Depends(get_poll_manager),
    user_manager: UserManager = Depends(get_user_manager),
):
    """Add a poll created by the current user"""
    user = user_manager.get_user_by_email(request.state.user)
    if user:
        poll = poll_manager.add_poll(user, poll_in)
        return poll


@poll_router.get("/{token}", response_model=PollResponse)
async def show_poll(token, poll_manager: PollManager = Depends(get_poll_manager)):
    """Retrieve a poll by it's unique token link"""
    return poll_manager.get_poll(token)


@poll_router.put("/{token}", response_model=PollResponse)
async def update_poll(
    request: Request,
    token,
    poll_in: PollRead,
    poll_manager: PollManager = Depends(get_poll_manager),
    user_manager: UserManager = Depends(get_user_manager),
):
    """Allow the creator to update a poll using it's unique token link"""
    user = user_manager.get_user_by_email(request.state.user)
    poll = poll_manager.update_poll(token, poll_in, user)
    return poll


@poll_router.delete("/{token}", response_model=PollResponse)
async def delete_poll(
    request: Request,
    token,
    poll_manager: PollManager = Depends(get_poll_manager),
    user_manager: UserManager = Depends(get_user_manager),
):
    """Allow the creator to delete a poll using it's unique token link"""
    user = user_manager.get_user_by_email(request.state.user)
    poll = poll_manager.delete_poll(token, user)
    return poll
