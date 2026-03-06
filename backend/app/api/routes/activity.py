from app.api.dependencies import (
    get_vote_manager,
    get_user_manager,
    get_activity_manager,
)
from fastapi import APIRouter, Depends, Request
from app.api.repository.activity_manager import ActivityManager
from app.api.repository.user_manager import UserManager
from app.core.security import oauth2_scheme
from app.api.schemas.activity import ActivityOut, ActivityIn
from app.api.schemas.poll import PollOut
from uuid import UUID
from typing import List


activity_router = APIRouter(dependencies=[Depends(oauth2_scheme)])


@activity_router.get("/activities", response_model=List[PollOut])
async def get_activity(
    request: Request,
    user_manager: UserManager = Depends(get_user_manager),
    activity_manager: ActivityManager = Depends(get_activity_manager),
) -> List[PollOut]:
    """Return polls created by other users and added by current user"""
    user = user_manager.get_user_by_email(request.state.user)
    return activity_manager.get_polls_by_user_id(user_id=user.id)


@activity_router.post("/activities", response_model=ActivityOut)
async def get_activity(
    request: Request,
    activity_in: ActivityIn,
    user_manager: UserManager = Depends(get_user_manager),
    activity_manager: ActivityManager = Depends(get_activity_manager),
) -> ActivityOut:
    """Return polls created by other users and added by current user"""
    user = user_manager.get_user_by_email(request.state.user)
    return activity_manager.add_poll_activity(user, activity_in)


@activity_router.delete("/activities/{uuid}", response_model=ActivityOut)
async def delete_poll(
    request: Request,
    uuid: UUID,
    activity_manager: ActivityManager = Depends(get_activity_manager),
    user_manager: UserManager = Depends(get_user_manager),
) -> ActivityOut:
    """Allow the creator to delete a poll using it's unique link"""
    user = user_manager.get_user_by_email(request.state.user)
    poll = activity_manager.delete_poll_activity(user, uuid)
    return poll
