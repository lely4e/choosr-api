from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime


class CommentIn(BaseModel):
    text: str = Field(..., min_length=3, max_length=255)


class CommentOut(BaseModel):
    id: int
    text: str
    user_id: int
    product_id: int
    created_at: datetime
    created_by: str

    model_config = ConfigDict(from_attributes=True)


class CommentListOut(BaseModel):
    id: int
    text: str
    created_by: str
    user_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
