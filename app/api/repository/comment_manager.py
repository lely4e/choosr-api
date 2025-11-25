from app.db.models import Product, Poll, Comment, User
from sqlalchemy.orm import Session, aliased
from app.core.errors import UserNotFoundError, CommentsNotFoundError


class CommentManager:
    def __init__(self, db: Session):
        self.db = db

    def add_comment(self, uuid, product_id, user, comment_in):
        """Add comment to the selected product"""
        product = (
            self.db.query(Product)
            .filter(Product.id == product_id)
            .filter(Poll.uuid == uuid)
            .first()
        )

        if not user or not product:
            raise UserNotFoundError("User or product not found")
        try:
            comment = Comment(
                text=comment_in.text,
                user_id=user.id,
                product_id=product.id,
            )

            self.db.add(comment)
            self.db.commit()
            self.db.refresh(comment)
            return comment

        except Exception as e:
            self.db.rollback()
            raise Exception(f"Error adding comment: {e}")

    def get_comments(self, uuid, product_id, user):
        """Retrieve comments for the selected product"""
        user_alias = aliased(User)
        product_alias = aliased(Product)
        comments = (
            self.db.query(
                Comment.id,
                Comment.text,
                user_alias.username.label("created_by"),
                product_alias.title.label("title"),
            )
            .join(user_alias, Comment.user_id == user_alias.id)
            .join(product_alias, Comment.product_id == product_alias.id)
            .filter(Comment.product_id == product_id)
            # .filter(Comment.user_id == user.id)
            .filter(Poll.uuid == uuid)
            .all()
        )
        return comments

    def get_comment(self, uuid, product_id, user, comment_id):
        """Retrieve a comment for the selected product"""
        user_alias = aliased(User)
        product_alias = aliased(Product)
        comment = (
            self.db.query(
                Comment.id,
                Comment.text,
                user_alias.username.label("created_by"),
                product_alias.title.label("title"),
            )
            .join(user_alias, Comment.user_id == user_alias.id)
            .join(product_alias, Comment.product_id == product_alias.id)
            .filter(Comment.product_id == product_id)
            # .filter(Comment.user_id == user.id)
            .filter(Poll.uuid == uuid)
            .where(Comment.id == comment_id)
            .first()
        )
        if not comment:
            raise CommentsNotFoundError("Comments not found")
        return comment

    def delete_comment(self, uuid, product_id, user, comment_id):
        """Delete a comment from the selected product"""
        product = (
            self.db.query(Product)
            .filter(Product.id == product_id)
            .filter(Poll.uuid == uuid)
            .first()
        )

        if not user or not product:
            raise UserNotFoundError("User or product not found")
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
                raise CommentsNotFoundError()

        except Exception as e:
            self.db.rollback()
            raise Exception(f"Error deleting comment: {e}")
