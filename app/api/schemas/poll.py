from pydantic import BaseModel
from uuid import UUID


class PollRead(BaseModel):
    title: str
    budget: int

    class Config:
        orm_mode = True


class PollResponse(PollRead):
    token: UUID

    class Config:
        orm_mode = True
