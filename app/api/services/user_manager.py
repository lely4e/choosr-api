from app.db.models import User
from sqlalchemy.orm import Session
from app.core.errors import UserNotFoundError, UserAlreadyExistsError
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
import jwt
from fastapi import Depends, HTTPException, status
from jwt import InvalidTokenError
from app.api.schemas.auth import TokenData
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
        """Register a new user"""
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
        """Retrieve all users"""
        users = self.db.query(User).all()
        if not users:
            raise UserNotFoundError("Users not found")
        return users

    def get_user(self, user_id):
        """Retrieve user by user id"""
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise UserNotFoundError("User not found")
        return user

    def get_user_by_name(self, username):
        """Retrieve user by user username"""
        user = self.db.query(User).filter(User.username == username).first()
        if not user:
            raise UserNotFoundError("User not found")
        return user

    def get_user_by_email(self, email):
        """Retrieve user by user email"""
        user = self.db.query(User).filter(User.email == email).first()
        if not user:
            raise UserNotFoundError("User not found")
        return user

    def authenticate_user(self, email: str, password: str):
        """Authenticate user"""
        user = self.db.query(User).filter(User.email == email).first()
        if not user:
            return False
        if not verify_password(password, user.password):
            return False
        return user

    def get_current_user(self, token: str = Depends(oauth2_scheme)):
        """Retrieve current user"""
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            email = payload.get("sub")

            if email is None:
                raise credentials_exception
            token_data = TokenData(email=email)
        except InvalidTokenError:
            raise credentials_exception
        user = self.get_user_by_email(token_data.email)
        if user is None:
            raise credentials_exception
        return user

    def update_user(self, user, user_in):
        """Update current user"""
        if not user:
            raise UserNotFoundError("User not found")
        try:
            user.username = user_in.username
            self.db.commit()
            self.db.refresh(user)
            return user
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e

    def delete_user(self, user):
        """Delete current user"""
        if not user:
            raise UserNotFoundError("User not found")
        try:
            self.db.delete(user)
            self.db.commit()
            return user
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e
