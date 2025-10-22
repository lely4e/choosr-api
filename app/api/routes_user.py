from app.api.schemas import UserIn, UserOut
from typing import List
from app.api.dependencies import get_user_manager
from fastapi import APIRouter, Depends, HTTPException
from crud_user import UserManager


user_router = APIRouter()


# get all users
@user_router.get("/users", response_model=List[UserOut])
async def read_users(user_manager: UserManager = Depends(get_user_manager)):
    users = user_manager.get_users()
    return users or {"error": "User not found"}


# add user
@user_router.post("/users", response_model=UserOut)
async def add_users(
    user_in: UserIn, user_manager: UserManager = Depends(get_user_manager)
):
    user = user_manager.add_user(**dict(user_in))
    return user or {"error": "User cannot be added"}


# get user
@user_router.get("/users/{user_id}", response_model=UserOut)
async def read_user(
    user_id: int, user_manager: UserManager = Depends(get_user_manager)
):
    user = user_manager.get_user(user_id)
    return user or {"error": "User not found"}


# update user
@user_router.put("/users/{user_id}", response_model=UserOut)
async def update_user(
    user_in: UserOut,
    user_id: int,
    user_manager: UserManager = Depends(get_user_manager),
):
    user = user_manager.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="No user found")

    try:
        user = user_manager.update_user(user_id, user_in)
        return user
    except Exception as e:
        return {"error": e}


# delete user
@user_router.delete("/users/{user_id}", response_model=UserOut)
async def delete_user(
    user_id: int, user_manager: UserManager = Depends(get_user_manager)
):
    user = user_manager.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="No user found")

    try:
        user = user_manager.delete_user(user_id)
        return user
    except Exception as e:
        return {"error": e}


# login
@user_router.post("/login")
async def login(user_in: UserIn, user_manager: UserManager = Depends(get_user_manager)):
    user = user_manager.login(**dict(user_in))
    if not user or user.password != user_in.password:
        return {"message": "User or password invalid"}

    return {"message": "You successfully login"}
