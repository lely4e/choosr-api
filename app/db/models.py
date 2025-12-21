from sqlalchemy import String, Integer, Float, ForeignKey, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base
import uuid as uuid_module
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String(30))
    email: Mapped[str] = mapped_column(String, index=True, unique=True)
    password: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # One-to-many relationship: a user can have many polls, products, votes
    polls: Mapped[list["Poll"]] = relationship(
        "Poll", back_populates="user", cascade="all, delete-orphan"
    )
    products: Mapped[list["Product"]] = relationship(
        "Product", back_populates="user", cascade="all, delete-orphan"
    )
    votes: Mapped[list["Vote"]] = relationship(
        "Vote", back_populates="user", cascade="all, delete-orphan"
    )
    comments: Mapped[list["Comment"]] = relationship(
        "Comment", back_populates="user", cascade="all, delete-orphan"
    )


class Poll(Base):
    __tablename__ = "polls"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(40), index=True)
    budget: Mapped[float] = mapped_column(Float)
    uuid: Mapped[uuid_module.UUID] = mapped_column(
        UUID(as_uuid=True), unique=True, nullable=False, default=uuid_module.uuid4
    )
    # One-to-many relationship
    products: Mapped[list["Product"]] = relationship(
        "Product", back_populates="poll", cascade="all, delete-orphan"
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # Foreign Key link to user id
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    # Relationship to the user
    user: Mapped["User"] = relationship("User", back_populates="polls")


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String, index=True)
    link: Mapped[str] = mapped_column(String)
    image: Mapped[str] = mapped_column(String)
    rating: Mapped[float] = mapped_column(Float)
    price: Mapped[float] = mapped_column(Float)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # Foreign Key link to user id, poll id
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    poll_id: Mapped[int] = mapped_column(ForeignKey("polls.id"))

    # Relationship to the user and poll
    user: Mapped["User"] = relationship("User", back_populates="products")
    poll: Mapped["Poll"] = relationship("Poll", back_populates="products")
    votes: Mapped[list["Vote"]] = relationship(
        "Vote", back_populates="product", cascade="all, delete-orphan"
    )
    comments: Mapped[list["Comment"]] = relationship(
        "Comment", back_populates="product", cascade="all, delete-orphan"
    )


class Vote(Base):
    __tablename__ = "votes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    # Foreign Key link to user id, product id
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))

    # Relationship to the user and product
    user: Mapped["User"] = relationship("User", back_populates="votes")
    product: Mapped["Product"] = relationship("Product", back_populates="votes")


class Comment(Base):
    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    text: Mapped[str] = mapped_column(String(200), index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # Foreign Key link to user id, product id
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))

    # Relationship to the user and product
    user: Mapped["User"] = relationship("User", back_populates="comments")
    product: Mapped["Product"] = relationship("Product", back_populates="comments")
