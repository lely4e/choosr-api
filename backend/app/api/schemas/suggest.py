from pydantic import BaseModel, ConfigDict, Field


class SuggestIn(BaseModel):
    event_type: str = Field(..., min_length=3, max_length=200)
    recipient_relation: str = Field(..., min_length=3, max_length=200)
    recipient_age: int = Field(..., ge=1, le=200)
    recipient_hobbies: str = Field(..., min_length=3, max_length=200)
    gift_type: str = Field(..., min_length=3, max_length=200)
    budget_range: int = Field(..., ge=1)
