from pydantic import BaseModel, EmailStr
from uuid import UUID


class UserIn(BaseModel):
    username: str
    email: EmailStr
    password: str

    class Config:
        orm_mode = True


class UserOut(BaseModel):
    username: str
    email: EmailStr

    class Config:
        orm_mode = True


class LogIn(BaseModel):
    email: EmailStr
    password: str

    class Config:
        orm_mode = True


class PollRead(BaseModel):
    title: str
    budget: int

    class Config:
        orm_mode = True


class PollResponse(PollRead):
    token: UUID

    class Config:
        orm_mode = True


class ProductAddJSON(BaseModel):
    id: int
    title: str
    body: str
    price: float
    user_id: int

    class Config:
        orm_mode = True


class ProductIn(BaseModel):
    link: str  # = Form()
    # user_id: int

    class Config:
        orm_mode = True


class ProductOut(BaseModel):
    id: int
    title: str
    description: str
    price: float

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: EmailStr | None = None


class Vote(BaseModel):
    user_id: int
    product_id: int

    class Config:
        orm_mode = True


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
