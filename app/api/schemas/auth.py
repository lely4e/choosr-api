from pydantic import BaseModel, EmailStr


class LogIn(BaseModel):
    email: EmailStr
    password: str

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: EmailStr | None = None
