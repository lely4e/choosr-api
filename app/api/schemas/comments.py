from pydantic import BaseModel


class CommentIn(BaseModel):
    text: str

    class Config:
        orm_mode = True


class CommentOut(BaseModel):
    id: int
    text: str
    user_id: int
    product_id: int

    class Config:
        orm_mode = True
