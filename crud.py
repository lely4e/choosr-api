from app.db.models import User
from sqlalchemy.orm import Session


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
        except Exception as e:
            self.db.rollback()
            print(f"Error adding user: {e}")
            return None

    def get_users(self):
        return self.db.query(User).all()

    def get_user(self, user_id):
        return self.db.query(User).filter(User.id == user_id).first()

    def delete_user(self, user_id: int):
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return None
        try:
            self.db.delete(user)
            self.db.commit()
            return user
        except Exception as e:
            self.db.rollback()
            print(f"error: e")
            return None

    def login(self, username: str, email: str, password: str):
        try:
            user = User(username=username, email=email, password=password)
            return self.db.query(User).filter(User.username == user.username).first()
        except Exception as e:
            self.db.rollback()
            print(f"Error adding user: {e}")
            return None
