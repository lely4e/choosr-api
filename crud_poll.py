from app.db.models import Poll
from sqlalchemy.orm import Session


class PollManager:
    def __init__(self, db: Session):
        self.db = db

    def add_poll(self, user_id, poll_in):
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
        return self.db.query(Poll).all()

    def get_poll(self, token):
        return self.db.query(Poll).filter(Poll.token == token).first()

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
            print(f"error: e")
            return None

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
            print(f"error: e")
            return None
