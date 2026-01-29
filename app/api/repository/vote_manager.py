from app.db.models import Product, Poll, Vote, Comment
from sqlalchemy.orm import Session, aliased
from app.core.errors import UserNotFoundError, ProductNotFoundError, VoteNotFoundError
from sqlalchemy import func, distinct, and_


class VoteManager:
    def __init__(self, db: Session):
        self.db = db

    def add_vote(self, uuid, product_id, user):
        """Add vote to a specific product"""

        product = (
            self.db.query(
                Product.id,
                Product.title,
                Product.link,
                Product.image,
                Product.rating,
                Product.price,
                func.count(Vote.user_id).label("votes"),
            )
            .outerjoin(Vote, Vote.product_id == Product.id)
            .join(Poll, Poll.id == Product.poll_id)
            .filter(Poll.uuid == uuid)
            .where(Product.id == product_id)
            .group_by(Product.id)
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

            vote = Vote(user_id=user.id, product_id=product.id, has_voted=True)

            self.db.add(vote)
            self.db.commit()
            self.db.refresh(vote)
            return vote

        except Exception as e:
            self.db.rollback()
            raise Exception(f"Error adding vote: {e}")

    def delete_vote(self, uuid, product_id, user):
        """Delete vote from the specific product"""
        product = (
            self.db.query(Product)
            .join(Poll, Product.poll_id == Poll.id)
            .filter(Product.id == product_id)
            .filter(Poll.uuid == uuid)
            .first()
        )
        if not product:
            raise ProductNotFoundError("Product not found")

        try:
            existing_vote = (
                self.db.query(Vote)
                .join(Product, Product.id == Vote.product_id)
                .join(Poll, Poll.id == Product.poll_id)
                .filter(Poll.uuid == uuid)
                .filter(Vote.product_id == product_id)
                .filter(Vote.user_id == user.id)
                .first()
            )

            if existing_vote:
                self.db.delete(existing_vote)
                self.db.commit()
                return {"message": "Vote was deleted successfully"}
            else:
                raise VoteNotFoundError("There are no votes to delete")

        except Exception as e:
            self.db.rollback()
            raise Exception(f"Error deleting vote: {e}")

    def get_vote_from_current_user(self, uuid, product_id, user):
        """Retrieve vote from current user"""
        product = (
            self.db.query(Product)
            .join(Poll, Product.poll_id == Poll.id)
            .filter(Product.id == product_id)
            .filter(Poll.uuid == uuid)
            .first()
        )
        if not product:
            raise ProductNotFoundError("Product not found")

        vote = (
            self.db.query(Vote)
            .join(Product, Product.id == Vote.product_id)
            .join(Poll, Poll.id == Product.poll_id)
            .filter(Poll.uuid == uuid)
            .filter(Vote.product_id == product_id)
            .filter(Vote.user_id == user.id)
            .first()
        )
        if not vote:
            raise VoteNotFoundError
        return vote

    def get_products_with_votes(self, uuid, user):
        """Retrieve all products with votes"""
        VoteAlias = aliased(Vote)
        votes = (
            self.db.query(
                Product.id,
                Product.title,
                Product.link,
                Product.image,
                Product.rating,
                Product.price,
                func.count(distinct(Vote.id)).label("votes"),
                (func.count(VoteAlias.id) > 0).label("has_voted"),
                func.count(distinct(Comment.id)).label("comments"),
            )
            .outerjoin(Vote, Vote.product_id == Product.id)
            .outerjoin(
                VoteAlias,
                and_(VoteAlias.product_id == Product.id, VoteAlias.user_id == user.id),
            )
            .outerjoin(Comment, Product.id == Comment.product_id)
            .join(Poll, Poll.id == Product.poll_id)
            .where(Poll.uuid == uuid)
            .group_by(Product.id)
            .all()
        )
        return votes
