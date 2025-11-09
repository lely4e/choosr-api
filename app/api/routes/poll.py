from app.api.schemas import PollRead, PollResponse
from typing import List
from app.api.dependencies import get_user_manager, get_poll_manager
from fastapi import APIRouter, Depends, Request
from app.api.services.user_manager import UserManager
from app.api.services.poll_manager import PollManager
from app.core.security import oauth2_scheme


poll_router = APIRouter(dependencies=[Depends(oauth2_scheme)])


# get all polls
@poll_router.get("/polls", response_model=List[PollResponse])
async def read_polls(poll_manager: PollManager = Depends(get_poll_manager)):
    return poll_manager.get_polls()


# add poll
@poll_router.post("/me/polls", response_model=PollResponse)
async def create_poll(
    request: Request,
    # user_id,
    poll_in: PollRead,
    poll_manager: PollManager = Depends(get_poll_manager),
    user_manager: UserManager = Depends(get_user_manager),
):
    user = user_manager.get_user_by_email(request.state.user)
    if user:
        poll = poll_manager.add_poll(user, poll_in)
        return poll


# get poll
@poll_router.get("/{token}", response_model=PollResponse)
async def show_poll(token, poll_manager: PollManager = Depends(get_poll_manager)):
    return poll_manager.get_poll(token)


# update poll
@poll_router.put("/{token}", response_model=PollResponse)
async def update_poll(
    token, poll_in: PollRead, poll_manager: PollManager = Depends(get_poll_manager)
):
    poll = poll_manager.update_poll(token, poll_in)
    return poll
