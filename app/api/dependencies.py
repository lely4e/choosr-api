from .services.user_manager import UserManager
from .services.poll_manager import PollManager
from .services.product_manager import ProductManager
from .services.vote_manager import VoteManager
from .services.comment_manager import CommentManager
from app.db.database import get_db
from sqlalchemy.orm import Session
from fastapi import Depends


def get_user_manager(db: Session = Depends(get_db)) -> UserManager:
    return UserManager(db)


def get_poll_manager(db: Session = Depends(get_db)) -> PollManager:
    return PollManager(db)


def get_product_manager(db: Session = Depends(get_db)) -> ProductManager:
    return ProductManager(db)


def get_vote_manager(db: Session = Depends(get_db)) -> VoteManager:
    return VoteManager(db)


def get_comment_manager(db: Session = Depends(get_db)) -> CommentManager:
    return CommentManager(db)
