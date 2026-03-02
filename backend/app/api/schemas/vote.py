from pydantic import BaseModel, ConfigDict


class VoteOut(BaseModel):
    user_id: int
    product_id: int
    has_voted: bool

    model_config = ConfigDict(from_attributes=True)
