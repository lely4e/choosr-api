from app.db.models import User, Poll
from sqlalchemy.orm import Session
from app.core.errors import UserNotFoundError, UserAlreadyExistsError
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
import jwt
from fastapi import Depends, HTTPException, status
from jwt.exceptions import InvalidTokenError
from app.api.schemas import TokenData
from app.core.security import (
    oauth2_scheme,
    SECRET_KEY,
    ALGORITHM,
    verify_password,
    get_password_hash,
)


class UserManager:
    def __init__(self, db: Session):
        self.db = db

    def sign_up_user(self, username: str, email: str, password: str):
        try:
            password = get_password_hash(password)
            user = User(username=username, email=email, password=password)
            self.db.add(user)
            self.db.commit()
            self.db.refresh(user)
            return user

        except IntegrityError:
            self.db.rollback()
            raise UserAlreadyExistsError("User with this email already exists")

        except Exception as e:
            self.db.rollback()
            raise Exception(f"Error adding user: {e}")

    def get_users(self):
        users = self.db.query(User).all()
        if not users:
            raise UserNotFoundError("Users not found")
        return users

    def get_user(self, user_id):
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise UserNotFoundError("User not found")
        return user

    def get_user_by_name(self, username):
        user = self.db.query(User).filter(User.username == username).first()
        if not user:
            raise UserNotFoundError("User not found")
        return user

    def authenticate_user(self, email: str, password: str):
        user = self.db.query(User).filter(User.email == email).first()
        if not user:
            return False
        if not verify_password(password, user.password):
            return False
        return user

    def get_current_user(self, token: str = Depends(oauth2_scheme)):
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            username = payload.get("sub")

            if username is None:
                raise credentials_exception
            token_data = TokenData(username=username)
        except InvalidTokenError:
            raise credentials_exception
        user = self.get_user_by_name(username=token_data.username)
        if user is None:
            raise credentials_exception
        return user

    def update_user(self, user_id, user_in):
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise UserNotFoundError("User not found")
        try:
            for k, v in user_in.dict().items():
                setattr(user, k, v)
            self.db.commit()
            return user
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e

    def delete_user(self, user_id: int):
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise UserNotFoundError("User not found")
        try:
            self.db.query(Poll).filter(Poll.user_id == user_id).delete()
            self.db.delete(user)
            self.db.commit()
            return user
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e

    def login(self, username: str, email: str, password: str):
        try:
            user = User(username=username, email=email, password=password)
            return self.db.query(User).filter(User.username == user.username).first()
        except Exception as e:
            self.db.rollback()
            raise Exception(f"Error login user: {e}")
