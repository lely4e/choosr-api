from pydantic import BaseModel
from datetime import datetime


class CommentIn(BaseModel):
    text: str

    class Config:
        orm_mode = True


class CommentOut(BaseModel):
    id: int
    text: str
    user_id: int
    product_id: int
    created_at: datetime

    class Config:
        orm_mode = True
