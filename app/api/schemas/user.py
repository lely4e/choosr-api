from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime


class UserIn(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserChange(BaseModel):
    username: str


class UserOut(BaseModel):
    username: str
    email: EmailStr
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
