from pydantic import BaseModel, EmailStr
from datetime import datetime


class UserIn(BaseModel):
    username: str
    email: EmailStr
    password: str

    class Config:
        orm_mode = True


class UserChange(BaseModel):
    username: str

    class Config:
        orm_mode = True


class UserOut(BaseModel):
    username: str
    email: EmailStr
    created_at: datetime

    class Config:
        orm_mode = True
