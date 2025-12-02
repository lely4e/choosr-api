from pydantic import BaseModel, ConfigDict
from datetime import datetime


class CommentIn(BaseModel):
    text: str


class CommentOut(BaseModel):
    id: int
    text: str
    user_id: int
    product_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
