from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from fastapi import status
from fastapi.exceptions import HTTPException
from app.core.errors import UserNotFoundError, IdeaNotFoundError, HistoryNotFoundError
from app.db.models import Ideas, History, Poll


class IdeaManager:
    def __init__(self, db: Session):
        self.db = db

    def add_idea(self, user, idea_in):
        """Add a custom idea"""
        if not user:
            raise UserNotFoundError("User not found")
        try:
            idea = Ideas(
                title={
                    "name": idea_in.name,
                    "category": [cat.capitalize() for cat in idea_in.category],
                },
                user_id=user,
            )
            self.db.add(idea)
            self.db.commit()
            self.db.refresh(idea)
            return idea

        except Exception as e:
            self.db.rollback()
            raise e

    def add_idea_from_history(self, user, uuid, history_id):
        """Add an idea from history"""
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

        idea_exist = (
            self.db.query(Ideas)
            .filter(Ideas.user_id == user.id)
            .where(history.id == Ideas.history_id)
            .first()
        )

        if idea_exist:
            raise HistoryNotFoundError("History is already in your ideas")

        try:
            idea = Ideas(
                title={
                    "name": history.titles["name"],
                    "category": history.titles["category"],
                },
                user_id=user.id,
                history_id=history.id,
            )

            self.db.add(idea)
            self.db.commit()
            self.db.refresh(idea)
            return idea

        except Exception as e:
            self.db.rollback()
            raise e

    def get_ideas(self, user_id, q=None):
        """Retrieve ideas created by current user filtered by categories"""
        ideas = self.db.query(Ideas).filter(Ideas.user_id == user_id)

        if q:
            ideas = ideas.filter(Ideas.title["category"].op("?")(q))

        return ideas.order_by(Ideas.title["category"][0].astext.asc()).all()

    def get_idea(self, user, idea_id):
        """Retrieve an idea by it's id"""
        return (
            self.db.query(Ideas)
            .filter(Ideas.user_id == user.id)
            .where(Ideas.id == idea_id)
            .order_by(Ideas.id.asc())
            .first()
        )

    def update_idea(self, user_id, idea_id, idea_in):
        """Update an idea by it's id"""
        idea = (
            self.db.query(Ideas)
            .filter(Ideas.id == idea_id)
            .where(Ideas.user_id == user_id)
            .first()
        )
        if not idea:
            raise IdeaNotFoundError("Idea not found")

        if not idea_in.name or not idea_in.name.strip():
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Field 'name' cannot be empty",
            )

        try:
            title_dict = dict(idea.title or {})
            title_dict["name"] = idea_in.name.strip()

            if idea_in.category is not None:
                title_dict["category"] = idea_in.category

            idea.title = title_dict

            self.db.commit()
            self.db.refresh(idea)
            return idea
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e

    def delete_idea(self, user_id, idea_id):
        """Delete an idea by it's id"""
        idea = (
            self.db.query(Ideas)
            .filter(Ideas.id == idea_id)
            .where(Ideas.user_id == user_id)
            .first()
        )

        if not idea:
            raise IdeaNotFoundError("Idea not found")
        try:
            self.db.delete(idea)
            self.db.commit()
            return idea
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e
