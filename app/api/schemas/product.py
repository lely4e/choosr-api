from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime


class ProductAddJSON(BaseModel):
    title: str
    link: str
    image: str
    rating: float
    price: float

    class Config:
        orm_mode = True


class ProductIn(BaseModel):
    link: str

    class Config:
        orm_mode = True


class ProductOut(BaseModel):
    id: int
    title: str
    description: str
    price: float
    created_at: datetime

    class Config:
        orm_mode = True


class ProductFull(BaseModel):
    id: int
    title: str
    link: str
    image: str
    rating: float
    price: float
    created_at: datetime

    class Config:
        orm_mode = True
