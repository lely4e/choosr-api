from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime


class PollRead(BaseModel):
    title: str
    budget: int


class PollResponse(PollRead):
    uuid: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
