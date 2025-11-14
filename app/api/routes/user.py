from app.api.schemas import UserOut, PollRead, PollResponse
from typing import List
from app.api.dependencies import get_user_manager, get_poll_manager
from fastapi import Depends, APIRouter, Depends, Request
from app.api.services.user_manager import UserManager
from app.api.services.poll_manager import PollManager
from app.core.security import oauth2_scheme


user_router = APIRouter(tags=["User"], dependencies=[Depends(oauth2_scheme)])


@user_router.get("", response_model=UserOut)
async def read_users_me(
    request: Request, user_manager: UserManager = Depends(get_user_manager)
):
    return user_manager.get_user_by_email(request.state.user)


@user_router.get("/polls", response_model=List[PollResponse])
async def read_own_items(
    request: Request,
    poll_manager: PollManager = Depends(get_poll_manager),
    user_manager: UserManager = Depends(get_user_manager),
):
    user = user_manager.get_user_by_email(request.state.user)
    return poll_manager.get_polls_by_user_id(user_id=user.id)


# update user
@user_router.put("", response_model=UserOut, dependencies=[Depends(oauth2_scheme)])  #
async def update_user(
    request: Request,
    user_in: UserOut,
    user_manager: UserManager = Depends(get_user_manager),
):
    user = user_manager.get_user_by_email(request.state.user)
    return user_manager.update_user(user, user_in)


# delete user
@user_router.delete("", response_model=UserOut, dependencies=[Depends(oauth2_scheme)])
async def delete_user(
    request: Request,
    user_manager: UserManager = Depends(get_user_manager),
):
    user = user_manager.get_user_by_email(request.state.user)
    return user_manager.delete_user(user)
