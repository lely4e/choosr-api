from pwdlib import PasswordHash
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta, timezone
import jwt
from app.core.config import settings

# to get a string like this: openssl rand -hex 32
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

password_hash = PasswordHash.recommended()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth")


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_password(plain_password, hashed_password):
    return password_hash.verify(plain_password, hashed_password)


def get_password_hash(password):
    return password_hash.hash(password)
