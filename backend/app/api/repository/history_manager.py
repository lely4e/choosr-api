from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from app.core.errors import HistoryNotFoundError, UserNotFoundError
from app.db.models import Poll, History


class HistoryManager:
    def __init__(self, db: Session):
        self.db = db

    def add_history(self, user, suggestion, uuid):
        """Add a history from ideas suggestion"""
        poll = self.db.query(Poll).filter(Poll.uuid == uuid).first()
        if not user or not poll:
            raise UserNotFoundError("User or poll not found")
        try:
            history = History(
                titles=suggestion,
                user_id=user.id,
                poll_id=poll.id,
            )
            self.db.add(history)
            self.db.commit()
            self.db.refresh(history)
            return history

        except Exception as e:
            self.db.rollback()
            raise e

    def get_history_by_id(self, user, history_id, uuid):
        """Retrieve history ideas search by current user"""
        poll = self.db.query(Poll).filter(Poll.uuid == uuid).first()
        if not user or not poll:
            raise UserNotFoundError("User or poll not found")

        history = (
            self.db.query(History)
            .filter(History.user_id == user.id)
            .where(History.poll_id == poll.id, History.id == history_id)
            .first()
        )
        if not history:
            raise HistoryNotFoundError("History not found")
        return history

    def get_history(self, user):
        """Retrieve history ideas search by current user"""
        if not user:
            raise UserNotFoundError("User not found")
        return (
            self.db.query(History)
            .filter(History.user_id == user.id)
            .order_by(History.id.asc())
            .all()
        )

    def get_history_by_uuid(self, user, uuid):
        """Retrieve history ideas search by current user"""
        poll = self.db.query(Poll).filter(Poll.uuid == uuid).first()
        if not user or not poll:
            raise UserNotFoundError("User or poll not found")

        return (
            self.db.query(History)
            .filter(History.user_id == user.id)
            .where(History.poll_id == poll.id)
            .order_by(History.id.asc())
            .all()
        )

    def delete_history(self, user, history_id, uuid):
        """Delete a history by it's id"""
        poll = self.db.query(Poll).filter(Poll.uuid == uuid).first()
        if not user or not poll:
            raise UserNotFoundError("User or poll not found")

        history = (
            self.db.query(History)
            .filter(History.id == history_id)
            .where(History.user_id == user.id)
            .first()
        )
        if not history:
            raise HistoryNotFoundError("History not found")
        try:
            self.db.delete(history)
            self.db.commit()
            return history
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e
