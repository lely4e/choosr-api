from app.api.schemas import UserIn, UserOut
from typing import List
from app.api.dependencies import get_user_manager

# import uuid
from sqlalchemy.orm import Session
from app.db.database import get_db
from fastapi import APIRouter, Depends, HTTPException
from app.db.models import User
from crud import UserManager


router = APIRouter()


# get all users
@router.get("/users", response_model=List[UserOut])
async def read_users(user_manager: UserManager = Depends(get_user_manager)):
    users = user_manager.get_users()
    return users or {"error": "User not found"}


# add user
@router.post("/users", response_model=UserOut)
async def add_users(
    user_in: UserIn, user_manager: UserManager = Depends(get_user_manager)
):
    user = user_manager.add_user(**dict(user_in))
    return user or {"error": "User cannot be added"}


# get user
@router.get("/users/{user_id}", response_model=UserOut)
async def read_user(
    user_id: int, user_manager: UserManager = Depends(get_user_manager)
):
    user = user_manager.get_user(user_id)
    return user or {"error": "User not found"}


# delete user
@router.delete("/users/{user_id}", response_model=UserOut)
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
@router.post("/login")
async def login(user_in: UserIn, user_manager: UserManager = Depends(get_user_manager)):
    user = user_manager.login(**dict(user_in))
    if not user or user.password != user_in.password:
        return {"message": "User or password invalid"}

    return {"message": "You successfully login"}


# @app.get("/polls/{token}")  # poll --> {link}
# async def show_poll():
#     return POLL


# @app.post("/polls", response_model=PollResponse)
# async def add_poll(poll: Poll):
#     poll = PollResponse(token=str(uuid.uuid4()), **poll.dict())
#     POLL.append(poll)
#     return poll


# @app.get("/polls/{token}/products")
# async def show_products():
#     return PRODUCT


# @app.post("/polls/{token}/products", response_model=Product)
# async def add_product(product: Product):
#     PRODUCT.append(
#         {"title": product.title, "body": product.body, "price": product.price}
#     )
#     return product
