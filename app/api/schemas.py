from pydantic import BaseModel
from uuid import UUID
from fastapi import APIRouter, Depends, Form


class UserIn(BaseModel):
    username: str
    email: str
    password: str

    class Config:
        orm_mode = True


class UserOut(BaseModel):
    username: str
    email: str

    class Config:
        orm_mode = True


class LogIn(BaseModel):
    email: str
    password: str

    class Config:
        orm_mode = True


class PollRead(BaseModel):
    # id: int
    title: str
    budget: int

    class Config:
        orm_mode = True


class PollResponse(PollRead):
    token: UUID

    class Config:
        orm_mode = True


class ProductAddJSON(BaseModel):
    title: str
    body: str
    price: float
    user_id: int

    class Config:
        orm_mode = True


class ProductIn(BaseModel):
    link: str  # = Form()
    user_id: int

    class Config:
        orm_mode = True


class ProductOut(BaseModel):
    title: str
    body: str
    price: float

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str | None = None
