from pydantic import BaseModel


class User(BaseModel):
    username: str
    password: str


class Poll(BaseModel):
    title: str
    budget: int


class PollResponse(Poll):
    token: str


class Product(BaseModel):
    title: str
    body: str
    price: int
