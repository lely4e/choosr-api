from pydantic import BaseModel, ConfigDict, Field
from uuid import UUID
from datetime import datetime


class PollIn(BaseModel):
    title: str = Field(..., min_length=3, max_length=100)
    budget: float = Field(..., gt=0)


class PollOut(BaseModel):
    title: str
    budget: float
    uuid: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
