from app.api.schemas.user import UserOut, UserChange
from app.api.dependencies import get_user_manager
from fastapi import Depends, APIRouter, Depends, Request
from app.api.services.user_manager import UserManager
from app.core.security import oauth2_scheme


user_router = APIRouter(dependencies=[Depends(oauth2_scheme)])


@user_router.get("", response_model=UserOut)
async def read_users_me(
    request: Request, user_manager: UserManager = Depends(get_user_manager)
) -> UserOut:
    """Return the authenticated user's information"""
    return user_manager.get_user_by_email(request.state.user)


@user_router.put("", response_model=UserChange)
async def update_user(
    request: Request,
    user_in: UserChange,
    user_manager: UserManager = Depends(get_user_manager),
) -> UserOut:
    """Update user's information"""
    user = user_manager.get_user_by_email(request.state.user)
    return user_manager.update_user(user, user_in)


@user_router.delete("", response_model=UserOut)
async def delete_user(
    request: Request,
    user_manager: UserManager = Depends(get_user_manager),
) -> UserOut:
    """Delete user"""
    user = user_manager.get_user_by_email(request.state.user)
    return user_manager.delete_user(user)
