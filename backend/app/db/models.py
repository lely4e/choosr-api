from sqlalchemy import (
    String,
    Integer,
    Float,
    ForeignKey,
    DateTime,
    func,
    Boolean,
    Date,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base
import uuid as uuid_module
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime, date
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy import Index


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String(30))
    email: Mapped[str] = mapped_column(String, index=True, unique=True)
    password: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # One-to-many relationship: a user can have many polls, products, votes, comments, activities
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
    activities: Mapped[list["Activity"]] = relationship(
        "Activity", back_populates="user", cascade="all, delete-orphan"
    )
    history: Mapped[list["History"]] = relationship(
        "History", back_populates="user", cascade="all, delete-orphan"
    )
    ideas: Mapped[list["Ideas"]] = relationship(
        "Ideas", back_populates="user", cascade="all, delete-orphan"
    )


class Poll(Base):
    __tablename__ = "polls"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(40), index=True)
    description: Mapped[str] = mapped_column(String(140), nullable=True)
    budget: Mapped[float] = mapped_column(Float)
    deadline: Mapped[date] = mapped_column(Date, nullable=True)
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
    activities: Mapped[list["Activity"]] = relationship(
        "Activity", back_populates="poll", cascade="all, delete-orphan"
    )

    history: Mapped[list["History"]] = relationship(
        "History", back_populates="poll", cascade="all, delete-orphan"
    )

    manually_closed: Mapped[bool] = mapped_column(
        "manually_closed", Boolean, nullable=False, default=False
    )

    @property
    def active(self) -> bool:
        """True if the poll is not manually closed and the deadline is not reached"""
        return not self.manually_closed or (
            self.deadline is None or self.deadline > date.today()
        )

    def close(self) -> None:
        """Close the poll manually"""
        self.manually_closed = True

    def open(self) -> None:
        """Open the poll manually"""
        self.manually_closed = False

    @property
    def created_by(self) -> str | None:
        return self.user.username if self.user else None

    @property
    def total_products(self) -> int:
        return len(self.products)


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
    has_voted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    # Foreign Key link to user id, product id
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))

    # Relationship to the user and product
    user: Mapped["User"] = relationship("User", back_populates="votes")
    product: Mapped["Product"] = relationship("Product", back_populates="votes")


class Comment(Base):
    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    text: Mapped[str] = mapped_column(String(255), index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    created_by: Mapped[str] = mapped_column(String, nullable=False)

    # Foreign Key link to user id, product id
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))

    # Relationship to the user and product
    user: Mapped["User"] = relationship("User", back_populates="comments")
    product: Mapped["Product"] = relationship("Product", back_populates="comments")


class Activity(Base):
    __tablename__ = "activities"

    # Ensure a user cannot add the same poll multiple times
    __table_args__ = (UniqueConstraint("user_id", "poll_id", name="uq_user_poll"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # Foreign Key link to user id, product id
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), index=True, nullable=False
    )
    poll_id: Mapped[int] = mapped_column(
        ForeignKey("polls.id", ondelete="CASCADE"), index=True, nullable=False
    )

    # Relationship
    user: Mapped["User"] = relationship("User", back_populates="activities")
    poll: Mapped["Poll"] = relationship("Poll", back_populates="activities")


class History(Base):
    __tablename__ = "history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    titles: Mapped[list] = mapped_column(JSONB, nullable=False)

    # Foreign Key link to user id, product id
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), index=True, nullable=False
    )
    poll_id: Mapped[int] = mapped_column(
        ForeignKey("polls.id", ondelete="CASCADE"), index=True, nullable=False
    )

    # Relationship
    user: Mapped["User"] = relationship("User", back_populates="history")
    poll: Mapped["Poll"] = relationship("Poll", back_populates="history")
    ideas: Mapped[list["Ideas"]] = relationship("Ideas", back_populates="history")


class Ideas(Base):
    __tablename__ = "ideas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    title: Mapped[dict] = mapped_column(JSONB, nullable=False)

    # Foreign Key link to user id and history id
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), index=True, nullable=False
    )

    history_id: Mapped[int] = mapped_column(
        ForeignKey("history.id", ondelete="SET NULL"), nullable=True
    )

    __table_args__ = (Index("idx_ideas_title_category", title, postgresql_using="gin"),)

    # Relationship
    user: Mapped["User"] = relationship("User", back_populates="ideas")
    history: Mapped["History"] = relationship("History", back_populates="ideas")
