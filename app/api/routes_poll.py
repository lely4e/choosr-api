from app.api.schemas import PollRead, PollResponse
from typing import List
from app.api.dependencies import get_user_manager, get_poll_manager
from fastapi import APIRouter, Depends, HTTPException
from crud_user import UserManager
from crud_poll import PollManager


poll_router = APIRouter()


# add poll
@poll_router.post("/{user_id}/polls", response_model=PollResponse)
async def create_poll(
    user_id,
    poll_in: PollRead,
    poll_manager: PollManager = Depends(get_poll_manager),
    user_manager: UserManager = Depends(get_user_manager),
):
    user = user_manager.get_user(user_id)
    if user:
        poll = poll_manager.add_poll(user_id, poll_in)
        return poll or {"error": "Poll cannot be added"}
    else:
        return {"message": "Bla"}


# get poll
@poll_router.get("/polls/{token}", response_model=PollResponse)
async def show_poll(token, poll_manager: PollManager = Depends(get_poll_manager)):
    poll = poll_manager.get_poll(token)
    return poll


# get all polls
@poll_router.get("/polls", response_model=List[PollRead])
async def read_polls(poll_manager: PollManager = Depends(get_poll_manager)):
    polls = poll_manager.get_polls()
    return polls or {"error": "Polls not found"}


# update poll
@poll_router.put("/polls/{token}", response_model=PollResponse)
async def update_poll(
    token, poll_in: PollRead, poll_manager: PollManager = Depends(get_poll_manager)
):
    poll = poll_manager.get_poll(token)
    if not poll:
        raise HTTPException(status_code=404, detail="No poll found")

    try:
        poll = poll_manager.update_poll(token, poll_in)
        return poll
    except Exception as e:
        return {"error": e}


# delete poll
@poll_router.delete("/polls/{token}", response_model=PollResponse)
async def delete_poll(token, poll_manager: PollManager = Depends(get_poll_manager)):
    poll = poll_manager.get_poll(token)
    if not poll:
        raise HTTPException(status_code=404, detail="No poll found")

    try:
        poll = poll_manager.delete_poll(token)
        return poll
    except Exception as e:
        return {"error": e}


# @app.get("/polls/{token}/products")
# async def show_products():
#     return PRODUCT


# @app.post("/polls/{token}/products", response_model=Product)
# async def add_product(product: Product):
#     PRODUCT.append(
#         {"title": product.title, "body": product.body, "price": product.price}
#     )
#     return product
