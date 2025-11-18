from pydantic import BaseModel, EmailStr


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
