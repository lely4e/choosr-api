from app.db.models import Poll, Product
from sqlalchemy.orm import Session, aliased
from sqlalchemy import func
from app.db.models import User
from app.core.errors import UserNotFoundError, PollNotFoundError
from sqlalchemy.exc import SQLAlchemyError
from fastapi.exceptions import HTTPException
from fastapi import status


class PollManager:
    def __init__(self, db: Session):
        self.db = db

    def add_poll(self, user, poll_in):
        """Add a poll"""
        if not user:
            raise UserNotFoundError("User not found")
        try:
            poll = Poll(
                title=poll_in.title,
                budget=poll_in.budget,
                user_id=user.id,
                description=poll_in.description,
                deadline=poll_in.deadline,
            )
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
        product_alias = aliased(Product)
        polls = (
            self.db.query(
                Poll.title,
                Poll.budget,
                Poll.uuid,
                Poll.description,
                Poll.deadline,
                user_alias.username.label("created_by"),
                func.count(product_alias.product_id).label("total_products"),
            )
            .join(user_alias, Poll.user_id == user_alias.id)
            .outerjoin(product_alias, product_alias.poll_id == Poll.id)
            .group_by(Poll.id, user_alias.id)
            .all()
        )
        return polls

    def get_polls_by_user_id(self, user_id):
        """Retrieve polls created by current user"""
        user_alias = aliased(User)
        product_alias = aliased(Product)
        polls = (
            self.db.query(
                Poll.title,
                Poll.budget,
                Poll.uuid,
                Poll.description,
                Poll.deadline,
                Poll.user_id,
                Poll.created_at,
                user_alias.username.label("created_by"),
                func.count(product_alias.id).label("total_products"),
            )
            .join(user_alias, Poll.user_id == user_alias.id)
            .outerjoin(product_alias, product_alias.poll_id == Poll.id)
            .filter(Poll.user_id == user_id)
            .group_by(Poll.id, user_alias.id)
            .all()
        )
        return polls

    def get_poll(self, uuid):
        """Retrieve a poll by it's unique link"""
        user_alias = aliased(User)
        product_alias = aliased(Product)
        poll = (
            self.db.query(
                Poll.title,
                Poll.budget,
                Poll.uuid,
                Poll.description,
                Poll.deadline,
                Poll.user_id,
                Poll.created_at,
                user_alias.username.label("created_by"),
                func.count(product_alias.id).label("total_products"),
            )
            .join(user_alias, Poll.user_id == user_alias.id)
            .outerjoin(product_alias, product_alias.poll_id == Poll.id)
            .filter(Poll.uuid == uuid)
            .group_by(Poll.id, user_alias.id)
            .first()
        )
        return poll

    def update_poll(self, uuid, poll_in, user):
        """Update a poll by it's unique link"""
        poll = (
            self.db.query(Poll)
            .filter(Poll.uuid == uuid)
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
            poll.description = poll_in.description
            poll.deadline = poll_in.deadline
            if not poll.title or not poll.budget:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                    detail="Field title or budget cannot be empty",
                )
            self.db.commit()
            self.db.refresh(poll)
            return poll
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e

    def delete_poll(self, uuid, user):
        """Delete a poll by it's unique link"""
        poll = (
            self.db.query(Poll)
            .filter(Poll.uuid == uuid)
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
