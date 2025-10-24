from app.db.models import User, Poll
from sqlalchemy.orm import Session
from app.core.errors import UserNotFoundError, UserAlreadyExistsError
from sqlalchemy.exc import IntegrityError, SQLAlchemyError


class UserManager:
    def __init__(self, db: Session):
        self.db = db

    def add_user(self, username: str, email: str, password: str):
        try:
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
