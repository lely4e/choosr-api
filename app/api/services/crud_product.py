from app.db.models import Product, User, Poll
from sqlalchemy.orm import Session
from app.core.errors import UserNotFoundError, ProductNotFoundError, PollNotFoundError
from sqlalchemy.exc import SQLAlchemyError
from app.products.products import get_info


class ProductManager:
    def __init__(self, db: Session):
        self.db = db

    def add_product(self, token, product_in):
        user = self.db.query(User).filter(User.id == product_in.user_id).first()
        poll = self.db.query(Poll).filter(Poll.token == token).first()
        if not user or not poll:
            raise UserNotFoundError("User or poll not found")
        try:
            product = Product(
                title=product_in.title,
                body=product_in.body,
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

    def add_product_link(self, token, product_in):
        user = self.db.query(User).filter(User.id == product_in.user_id).first()
        poll = self.db.query(Poll).filter(Poll.token == token).first()
        if not poll:
            raise UserNotFoundError("User or poll not found")
        try:
            title, body, price = get_info(product_in.link)
            product = Product(
                title=title,
                body=body,
                price=price,
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

    def get_products(self, token):
        poll = self.db.query(Poll).filter(Poll.token == token).first()
        if not poll:
            raise PollNotFoundError("Poll not found")
        return poll.products

    def get_product(self, token, product_id):
        product = (
            self.db.query(Product)
            .filter(Product.id == product_id)
            .filter(Poll.token == token)
            .first()
        )
        if not product:
            raise ProductNotFoundError("Product not found")
        return product

    def delete_product(self, token, product_id):
        product = (
            self.db.query(Product)
            .filter(Product.id == product_id)
            .filter(Poll.token == token)
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
