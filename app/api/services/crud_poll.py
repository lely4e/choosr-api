from app.db.models import Poll
from sqlalchemy.orm import Session
from app.db.models import User
from app.core.errors import UserNotFoundError
from app.core.errors import PollNotFoundError
from sqlalchemy.exc import SQLAlchemyError


class PollManager:
    def __init__(self, db: Session):
        self.db = db

    def add_poll(self, user, poll_in):
        # user = self.db.query(User).filter(User.id == user_id).first()
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
        polls = self.db.query(Poll).all()
        if not polls:
            raise PollNotFoundError("Polls not found")
        return polls

    def get_polls_by_user_id(self, user_id):
        polls = self.db.query(Poll).filter(Poll.user_id == user_id).all()
        if not polls:
            raise PollNotFoundError("Polls not found")
        return polls

    def get_poll(self, token):
        poll = self.db.query(Poll).filter(Poll.token == token).first()
        if not poll:
            raise PollNotFoundError("Poll not found")
        return poll

    def update_poll(self, token, poll_in):
        poll = self.db.query(Poll).filter(Poll.token == token).first()
        if not poll:
            raise PollNotFoundError("Poll not found")
        try:
            # for k, v in poll_in.dict().items():
            #     setattr(poll, k, v)
            poll.title = poll_in.title
            poll.budget = poll_in.budget
            self.db.commit()
            self.db.refresh(poll)
            return poll
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e

    def delete_poll(self, token):
        poll = self.db.query(Poll).filter(Poll.token == token).first()
        if not poll:
            raise PollNotFoundError("Poll not found")
        try:
            self.db.delete(poll)
            self.db.commit()
            return poll
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e
