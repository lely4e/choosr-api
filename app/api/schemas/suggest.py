from pydantic import BaseModel, ConfigDict, Field


class SuggestIn(BaseModel):
    event_type: str = Field(..., min_length=3, max_length=200)
    recipient_relation: str = Field(..., min_length=3, max_length=200)
    recipient_age: str = Field(..., min_length=1, max_length=200)
    recipient_hobbies: str = Field(..., min_length=3, max_length=200)
    gift_type: str = Field(..., min_length=3, max_length=200)
    budget_range: str = Field(..., min_length=1, max_length=200)
