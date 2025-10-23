from app.db.models import Poll
from sqlalchemy.orm import Session
from app.db.models import User
from app.core.errors import UserNotFoundError
from app.core.errors import PollNotFoundError
from psycopg2.errors import InvalidTextRepresentation


class PollManager:
    def __init__(self, db: Session):
        self.db = db

    def add_poll(self, user_id, poll_in):
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise UserNotFoundError("User not found")
        try:
            poll = Poll(title=poll_in.title, budget=poll_in.budget, user_id=user_id)
            self.db.add(poll)
            self.db.commit()
            self.db.refresh(poll)
            return poll
        except Exception as e:
            self.db.rollback()
            print(f"Error adding poll: {e}")
            return None

    def get_polls(self):
        polls = self.db.query(Poll).all()
        if not polls:
            raise PollNotFoundError("Polls not found")
        return polls

    def get_poll(self, token):
        poll = self.db.query(Poll).filter(Poll.token == token).first()
        if not poll:
            raise (
                PollNotFoundError("Polls not found"),
                InvalidTextRepresentation("Polls not found"),
            )
        return poll

    def update_poll(self, token, poll_in):
        poll = self.db.query(Poll).filter(Poll.token == token).first()
        if not poll:
            return None
        try:
            for k, v in poll_in.dict().items():
                setattr(poll, k, v)
            self.db.commit()
            return poll
        except Exception as e:
            self.db.rollback()
            raise Exception(f"Error updating poll: {e}")

    def delete_poll(self, token):
        poll = self.db.query(Poll).filter(Poll.token == token).first()
        if not poll:
            return None
        try:
            self.db.delete(poll)
            self.db.commit()
            return poll
        except Exception as e:
            self.db.rollback()
            raise Exception(f"Error deleting poll: {e}")
