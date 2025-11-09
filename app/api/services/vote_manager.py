from app.db.models import Product, Poll, Vote, Comment
from sqlalchemy.orm import Session
from app.core.errors import UserNotFoundError, ProductNotFoundError
from sqlalchemy import func


class VoteManager:
    def __init__(self, db: Session):
        self.db = db

    def add_vote(self, token, product_id, user):
        product = (
            self.db.query(Product)
            .filter(Product.id == product_id)
            .filter(Poll.token == token)
            .first()
        )

        if not user or not product:
            raise UserNotFoundError("User or product not found")
        try:
            existing_vote = (
                self.db.query(Vote)
                .filter(Vote.product_id == product_id)
                .filter(Vote.user_id == user.id)
                .first()
            )

            if existing_vote:
                return {"message": "You can vote only once"}

            vote = Vote(
                user_id=user.id,
                product_id=product.id,
            )

            self.db.add(vote)
            self.db.commit()
            self.db.refresh(vote)
            return vote

        except Exception as e:
            self.db.rollback()
            raise Exception(f"Error adding vote: {e}")

    def delete_vote(self, token, product_id, user):
        product = (
            self.db.query(Product)
            .filter(Product.id == product_id)
            .filter(Poll.token == token)
            .first()
        )

        if not user or not product:
            raise UserNotFoundError("User or product not found")
        try:
            existing_vote = (
                self.db.query(Vote)
                .filter(Vote.product_id == product_id)
                .filter(Vote.user_id == user.id)
                .first()
            )

            if existing_vote:
                self.db.delete(existing_vote)
                self.db.commit()
                return {"message": "Vote was deleted successfully"}

        except Exception as e:
            self.db.rollback()
            raise Exception(f"Error adding vote: {e}")

    def get_votes_product(self, token, product_id):
        votes = (
            self.db.query(
                Product.id,
                Product.title,
                Product.description,
                Product.price,
                func.count(Vote.user_id).label("votes"),
            )
            .outerjoin(Vote, Vote.product_id == Product.id)
            .join(Poll, Poll.id == Product.poll_id)
            .filter(Poll.token == token)
            .where(Product.id == product_id)
            .group_by(Product.id)
            .first()
        )
        if not votes:
            raise ProductNotFoundError("Product not found")
        return votes

    def get_products_with_votes(self, token):
        votes = (
            self.db.query(
                Product.id,
                Product.title,
                Product.description,
                Product.price,
                func.count(Vote.user_id).label("votes"),
            )
            .outerjoin(Vote, Vote.product_id == Product.id)
            .join(Poll, Poll.id == Product.poll_id)
            .where(Poll.token == token)
            .group_by(Product.id)
            .all()
        )
        return votes
