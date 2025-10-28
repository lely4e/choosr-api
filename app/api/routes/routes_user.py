from app.api.schemas import UserIn, UserOut
from typing import List
from app.api.dependencies import get_user_manager
from fastapi import Depends, HTTPException, status, APIRouter, Depends, Request
from app.api.services.crud_user import UserManager
from fastapi.security import OAuth2PasswordRequestForm
from app.api.schemas import Token, UserIn
from app.core.security import oauth2_scheme, create_access_token


user_router = APIRouter()


# get all users
@user_router.get("/users", response_model=List[UserOut])
async def read_users(user_manager: UserManager = Depends(get_user_manager)):
    users = user_manager.get_users()
    return users


# add user
@user_router.post("/users", response_model=UserOut)
async def add_users(
    user_in: UserIn, user_manager: UserManager = Depends(get_user_manager)
):
    user = user_manager.add_user(**dict(user_in))
    return user


# get user
@user_router.get("/users/{user_id}", response_model=UserOut)
async def read_user(
    user_id: int, user_manager: UserManager = Depends(get_user_manager)
):
    user = user_manager.get_user(user_id)
    return user


# update user
@user_router.put("/users/{user_id}", response_model=UserOut)
async def update_user(
    user_in: UserOut,
    user_id: int,
    user_manager: UserManager = Depends(get_user_manager),
):
    user = user_manager.update_user(user_id, user_in)
    return user


# delete user
@user_router.delete("/users/{user_id}", response_model=UserOut)
async def delete_user(
    user_id: int, user_manager: UserManager = Depends(get_user_manager)
):
    user = user_manager.delete_user(user_id)
    return user  # or {"message": "User was deleted successfully"}


@user_router.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    user_manager: UserManager = Depends(get_user_manager),
) -> Token:
    user = user_manager.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username})
    return Token(access_token=access_token, token_type="bearer")


@user_router.get("/me", response_model=UserOut)
async def read_users_me(
    token: str = Depends(oauth2_scheme),
    user_manager: UserManager = Depends(get_user_manager),
):
    user = user_manager.get_current_user(token=token)
    return user


# @user_router.get("/users/me/items/")
# async def read_own_items(
#     current_user: UserIn = Depends(get_current_active_user),
# ):
#     return [{"item_id": "Foo", "owner": current_user.username}]
