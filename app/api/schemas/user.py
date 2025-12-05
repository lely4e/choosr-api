from pydantic import BaseModel, EmailStr, ConfigDict, Field
from datetime import datetime


class UserIn(BaseModel):
    username: str = Field(..., min_length=3, max_length=20)
    email: EmailStr = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8)


class UserChange(BaseModel):
    username: str


class UserOut(BaseModel):
    username: str
    email: EmailStr
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
