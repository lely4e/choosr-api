from app.db.models import Product, Poll, Comment, User
from sqlalchemy.orm import Session, aliased
from app.core.errors import (
    UserNotFoundError,
    CommentsNotFoundError,
    ProductNotFoundError,
)


class CommentManager:
    def __init__(self, db: Session):
        self.db = db

    def add_comment(self, uuid, product_id, user, comment_in):
        """Add comment to the selected product"""
        product = (
            self.db.query(Product)
            .filter(Product.id == product_id)
            .filter(Poll.uuid == uuid)
            .join(Poll, Product.poll_id == Poll.id)
            .first()
        )

        if not product:
            raise ProductNotFoundError("Product not found")
        try:
            comment = Comment(
                text=comment_in.text,
                user_id=user.id,
                product_id=product.id,
                created_by=user.username,
            )

            self.db.add(comment)
            self.db.commit()
            self.db.refresh(comment)
            return comment

        except Exception as e:
            self.db.rollback()
            raise e

    def get_comments(self, uuid, product_id, user):
        """Retrieve comments for the selected product"""
        product = (
            self.db.query(Product)
            .join(Poll, Poll.id == Product.poll_id)
            .filter(Poll.uuid == uuid)
            .filter(Product.id == product_id)
            .first()
        )

        if not product:
            raise ProductNotFoundError("Product not found")

        user_alias = aliased(User)
        comments = (
            self.db.query(
                Comment.id,
                Comment.text,
                user_alias.username.label("created_by"),
                Comment.user_id,
                Comment.created_at,
            )
            .join(user_alias, Comment.user_id == user_alias.id)
            .filter(Comment.product_id == product.id)
            .all()
        )
        return comments

    def get_comment(self, uuid, product_id, user, comment_id):
        """Retrieve a comment for the selected product"""
        product = (
            self.db.query(Product)
            .join(Poll, Poll.id == Product.poll_id)
            .filter(Poll.uuid == uuid)
            .filter(Product.id == product_id)
            .first()
        )

        if not product:
            raise ProductNotFoundError("Product not found")

        user_alias = aliased(User)
        comment = (
            self.db.query(
                Comment.id,
                Comment.text,
                user_alias.username.label("created_by"),
                Comment.user_id,
                Comment.created_at,
            )
            .join(user_alias, Comment.user_id == user_alias.id)
            .filter(Comment.id == comment_id)
            .filter(Comment.product_id == product.id)
            .first()
        )

        if not comment:
            raise CommentsNotFoundError("Comments not found")
        return comment

    def delete_comment(self, uuid, product_id, user, comment_id):
        """Delete a comment from the selected product"""
        product = (
            self.db.query(Product)
            .join(Poll, Poll.id == Product.poll_id)
            .filter(Poll.uuid == uuid)
            .filter(Product.id == product_id)
            .first()
        )

        if not product:
            raise ProductNotFoundError("Product not found")
        try:
            comment = (
                self.db.query(Comment)
                .filter(Comment.product_id == product_id)
                .filter(Comment.user_id == user.id)
                .where(Comment.id == comment_id)
                .first()
            )

            if comment:
                self.db.delete(comment)
                self.db.commit()
                return {"message": "Comment was deleted successfully"}

            else:
                raise CommentsNotFoundError("Comment not found")

        except Exception as e:
            self.db.rollback()
            raise e
