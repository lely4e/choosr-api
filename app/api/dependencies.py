from .services.crud_user import UserManager
from .services.crud_poll import PollManager
from app.db.database import get_db
from sqlalchemy.orm import Session
from fastapi import Depends


def get_user_manager(db: Session = Depends(get_db)) -> UserManager:
    return UserManager(db)


def get_poll_manager(db: Session = Depends(get_db)) -> PollManager:
    return PollManager(db)
