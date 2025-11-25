from app.db.models import Product, Poll
from sqlalchemy.orm import Session
from app.core.errors import (
    UserNotFoundError,
    ProductNotFoundError,
    PollNotFoundError,
)
from sqlalchemy.exc import SQLAlchemyError


class ProductManager:
    def __init__(self, db: Session):
        self.db = db

    def add_product(self, uuid, product_in, user):
        """Add a product to the selected poll"""
        poll = self.db.query(Poll).filter(Poll.uuid == uuid).first()
        if not user or not poll:
            raise UserNotFoundError("User or poll not found")
        try:
            product = Product(
                title=product_in.title,
                link=product_in.link,
                image=product_in.image,
                rating=product_in.rating,
                price=product_in.price,
                user_id=user.id,
                poll_id=poll.id,
            )
            self.db.add(product)
            self.db.commit()
            self.db.refresh(product)
            return product

        except Exception as e:
            self.db.rollback()
            raise Exception(f"Error adding product: {e}")

    def get_products(self, uuid):
        """Retrieve all products from the selected poll"""
        poll = self.db.query(Poll).filter(Poll.uuid == uuid).first()
        if not poll:
            raise PollNotFoundError("Poll not found")
        return poll.products

    def get_product(self, uuid, product_id):
        """Retrieve specific product from the selected poll"""
        product = (
            self.db.query(Product)
            .filter(Product.id == product_id)
            .filter(Poll.uuid == uuid)
            .first()
        )
        if not product:
            raise ProductNotFoundError("Product not found")
        return product

    def delete_product(self, uuid, product_id, user):
        """Delete specific product from the selected poll"""
        product = (
            self.db.query(Product)
            .filter(Product.id == product_id)
            .filter(Poll.uuid == uuid)
            .where(Product.user_id == user.id)
            .first()
        )
        if not product:
            raise ProductNotFoundError("Product not found")
        try:
            self.db.delete(product)
            self.db.commit()
            return product
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e
