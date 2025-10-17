from fastapi import FastAPI
from fake_db import USERS_DATA, POLL, PRODUCT
from api import User, Poll, PollResponse, Product
import uuid

app = FastAPI()


@app.post("/login")
async def login(user_in: User):
    # As draft in body JSON
    for user in USERS_DATA:
        if (
            user.get("username") == user_in.username
            and user.get("password") == user_in.password
        ):
            return {"message": "You successfully login"}
    return {"message": "User or password invalid"}


@app.get("/polls/{token}")  # poll --> {link}
async def show_poll():
    return POLL


@app.post("/polls", response_model=PollResponse)
async def add_poll(poll: Poll):
    poll = PollResponse(token=str(uuid.uuid4()), **poll.dict())
    POLL.append(poll)
    return poll


@app.get("/polls/{token}/products")
async def show_products():
    return PRODUCT


@app.post("/polls/{token}/products", response_model=Product)
async def add_product(product: Product):
    PRODUCT.append(
        {"title": product.title, "body": product.body, "price": product.price}
    )
    return product
