from app.db.models import Poll
from sqlalchemy.orm import Session, aliased
from app.db.models import User
from app.core.errors import UserNotFoundError, PollNotFoundError
from sqlalchemy.exc import SQLAlchemyError


class PollManager:
    def __init__(self, db: Session):
        self.db = db

    def add_poll(self, user, poll_in):
        """Add a poll"""
        if not user:
            raise UserNotFoundError("User not found")
        try:
            poll = Poll(title=poll_in.title, budget=poll_in.budget, user_id=user.id)
            self.db.add(poll)
            self.db.commit()
            self.db.refresh(poll)
            return poll

        except Exception as e:
            self.db.rollback()
            raise Exception(f"Error adding poll: {e}")

    def get_polls(self):
        """Retrieve all polls"""
        user_alias = aliased(User)
        polls = (
            self.db.query(
                Poll.title,
                Poll.budget,
                Poll.token,
                user_alias.username.label("created_by"),
            )
            .join(user_alias, Poll.user_id == user_alias.id)
            .all()
        )
        return polls

    def get_polls_by_user_id(self, user_id):
        """Retrieve polls created by current user"""
        return self.db.query(Poll).filter(Poll.user_id == user_id).all()

    def get_poll(self, token):
        """Retrieve a poll by it's unique token link"""
        poll = self.db.query(Poll).filter(Poll.token == token).first()
        if not poll:
            raise PollNotFoundError("Poll not found")
        return poll

    def update_poll(self, token, poll_in, user):
        """Update a poll by it's unique token link"""
        poll = (
            self.db.query(Poll)
            .filter(Poll.token == token)
            .where(Poll.user_id == user.id)
            .first()
        )
        if not poll:
            raise PollNotFoundError(
                "You are not allowed to edit a poll owned by another user"
            )
        try:
            poll.title = poll_in.title
            poll.budget = poll_in.budget
            self.db.commit()
            self.db.refresh(poll)
            return poll
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e

    def delete_poll(self, token, user):
        """Delete a poll by it's unique token link"""
        poll = (
            self.db.query(Poll)
            .filter(Poll.token == token)
            .where(Poll.user_id == user.id)
            .first()
        )
        if not poll:
            raise PollNotFoundError(
                "You are not allowed to delete a poll owned by another user"
            )
        try:
            self.db.delete(poll)
            self.db.commit()
            return poll
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e
