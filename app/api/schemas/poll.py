from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class PollRead(BaseModel):
    title: str
    budget: int

    class Config:
        orm_mode = True


class PollResponse(PollRead):
    token: UUID
    created_at: datetime

    class Config:
        orm_mode = True
