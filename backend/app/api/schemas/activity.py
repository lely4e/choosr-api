from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from uuid import UUID


class ActivityIn(BaseModel):
    uuid: UUID


class ActivityOut(BaseModel):
    id: int
    user_id: int
    poll_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
