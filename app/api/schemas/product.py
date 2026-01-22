from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional


class ProductAddJSON(BaseModel):
    title: str = Field(..., min_length=3, max_length=500)
    link: str = Field(..., min_length=3)
    image: str = Field(..., min_length=3)
    rating: float = Field(..., ge=0, le=5)
    price: float = Field(..., gt=0)


class ProductIn(BaseModel):
    link: str


class ProductOut(BaseModel):
    id: int
    title: str
    link: str
    image: str
    rating: float
    price: float
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProductSearchOut(BaseModel):
    title: str
    link: str
    image: str
    rating: Optional[float] = None
    price: Optional[float] = None

    model_config = ConfigDict(from_attributes=True)


class ProductListOut(BaseModel):
    id: int
    title: str
    link: str
    image: str
    rating: float
    price: float
    votes: Optional[int]
    comments: Optional[int]

    model_config = ConfigDict(from_attributes=True)
