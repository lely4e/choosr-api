from app.db.models import Poll, Product, Activity
from sqlalchemy.orm import Session, aliased
from sqlalchemy import func
from app.db.models import User
from app.core.errors import UserNotFoundError, PollNotFoundError, PollAlreadyExist
from sqlalchemy.exc import SQLAlchemyError
from fastapi.exceptions import HTTPException
from fastapi import status


class ActivityManager:
    def __init__(self, db: Session):
        self.db = db

    def add_poll_activity(self, user, activity_in):
        """Add a poll"""
        if not user:
            raise UserNotFoundError("User not found")

        existing = (
            self.db.query(Activity)
            .filter(
                Activity.user_id == user.id, Activity.poll.has(uuid=activity_in.uuid)
            )
            .first()
        )

        if existing:
            raise PollAlreadyExist()

        poll = self.db.query(Poll).filter(Poll.uuid == activity_in.uuid).first()

        # if poll.user_id == user.id:
        #     raise Exception("You cannot add your own poll to shared polls.")

        if poll:
            try:
                activity = Activity(
                    user_id=user.id,
                    poll_id=poll.id,
                )
                self.db.add(activity)
                self.db.commit()
                self.db.refresh(activity)
                return activity

            except Exception as e:
                self.db.rollback()
                raise Exception(f"Error adding poll: {e}")

    def get_polls_by_user_id(self, user_id):
        """Retrieve shared added by current user"""
        polls = (
            self.db.query(Poll).join(Activity).filter(Activity.user_id == user_id).all()
        )
        return polls

    def delete_poll_activity(self, user, uuid):
        """Delete a shared poll by it's unique link"""
        poll = (
            self.db.query(Activity)
            .filter(
                Activity.user_id == user.id,
                Activity.poll.has(Poll.uuid == uuid),
            )
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
