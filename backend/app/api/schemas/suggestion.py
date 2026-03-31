from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import List


class SuggestIn(BaseModel):
    event_type: str = Field(..., min_length=3, max_length=200)
    recipient_relation: str = Field(..., min_length=3, max_length=200)
    recipient_age: int = Field(..., ge=1, le=200)
    recipient_hobbies: str = Field(..., min_length=3, max_length=200)
    gift_type: str = Field(..., min_length=3, max_length=200)
    budget_range: int = Field(..., ge=1)


class SuggestOut(BaseModel):
    name: str = Field(..., min_length=3, max_length=200)
    category: List[str]

    model_config = ConfigDict(from_attributes=True)


class TitleItem(BaseModel):
    name: str = Field(..., min_length=3, max_length=200)
    category: List[str]


class HistoryOut(BaseModel):
    id: int
    titles: TitleItem
    user_id: int
    poll_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
