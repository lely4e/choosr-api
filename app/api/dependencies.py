from crud import UserManager
from app.db.database import get_db
from sqlalchemy.orm import Session
from fastapi import Depends


def get_user_manager(db: Session = Depends(get_db)) -> UserManager:
    return UserManager(db)
