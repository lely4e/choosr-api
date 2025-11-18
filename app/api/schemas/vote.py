from pydantic import BaseModel


class VoteOut(BaseModel):
    user_id: int
    product_id: int

    class Config:
        orm_mode = True
