from pydantic import BaseModel, ConfigDict
from datetime import datetime


class ProductAddJSON(BaseModel):
    title: str
    link: str
    image: str
    rating: float
    price: float


class ProductIn(BaseModel):
    link: str


class ProductOut(BaseModel):
    id: int
    title: str
    description: str
    price: float
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProductFull(BaseModel):
    id: int
    title: str
    link: str
    image: str
    rating: float
    price: float
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
