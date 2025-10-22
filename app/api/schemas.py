from pydantic import BaseModel


class UserIn(BaseModel):
    username: str
    email: str
    password: str

    class Config:
        orm_mode = True


class UserOut(BaseModel):
    username: str
    email: str

    class Config:
        orm_mode = True


class PollRead(BaseModel):
    title: str
    budget: int

    class Config:
        orm_mode = True


class PollResponse(PollRead):
    token: str

    class Config:
        orm_mode = True


class ProductRead(BaseModel):
    title: str
    body: str
    price: int

    class Config:
        orm_mode = True
