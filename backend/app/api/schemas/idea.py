from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import List, Optional


class Idea(BaseModel):
    name: str = Field(..., min_length=3, max_length=200)


class IdeaIn(BaseModel):
    name: str = Field(..., min_length=3, max_length=200)
    category: List[str]


class TitleSchema(BaseModel):
    name: str
    category: List[str]


class IdeaUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[List[str]] = None


class IdeaOut(BaseModel):
    id: int
    title: TitleSchema
    user_id: int
    history_id: int | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
