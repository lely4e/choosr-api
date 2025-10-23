from app.api.schemas import UserIn, UserOut
from typing import List
from app.api.dependencies import get_user_manager
from fastapi import APIRouter, Depends, HTTPException
from crud_user import UserManager
from app.core.errors import UserNotFoundError


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
    try:
        user = user_manager.update_user(user_id, user_in)
        return user
    except UserNotFoundError:
        raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# delete user
@user_router.delete("/users/{user_id}", response_model=UserOut)
async def delete_user(
    user_id: int, user_manager: UserManager = Depends(get_user_manager)
):
    try:
        user = user_manager.delete_user(user_id)
        return user  # or {"message": "User was deleted successfully"}
    except UserNotFoundError:
        raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# login
@user_router.post("/login")
async def login(user_in: UserIn, user_manager: UserManager = Depends(get_user_manager)):
    user = user_manager.login(**dict(user_in))
    if not user or user.password != user_in.password:
        return {"message": "User or password invalid"}
    return {"message": "You successfully login"}
