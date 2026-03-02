from pydantic import BaseModel, ConfigDict, Field
from uuid import UUID
from datetime import datetime
from typing import Optional
from datetime import date


class PollIn(BaseModel):
    title: str = Field(..., min_length=3, max_length=100)
    budget: float = Field(..., gt=0)
    description: Optional[str] = Field(None, min_length=3, max_length=140)
    deadline: Optional[date] = Field(None)


class PollOut(BaseModel):
    title: str
    budget: float
    description: Optional[str] = None
    deadline: Optional[date] = None
    uuid: UUID
    user_id: int
    created_at: datetime
    total_products: int
    created_by: str

    model_config = ConfigDict(from_attributes=True)
