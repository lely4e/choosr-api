from dotenv import load_dotenv

load_dotenv(".env.test")

import pytest
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool
from httpx import AsyncClient, ASGITransport
from main import app
from app.db.database import Base, get_db
import pytest_asyncio
from app.db.models import User, Poll, Product, Comment, Vote
from app.core.security import create_access_token
from faker import Faker
import random

TEST_DATABASE_URL = f"postgresql://{os.getenv("DB_USER")}:{os.getenv("DB_PASS")}@{os.getenv("DB_HOST")}:{os.getenv("DB_PORT")}/{os.getenv("DB_NAME")}"
# NuLLPool to avoid connections being reused between tests
test_engine = create_engine(TEST_DATABASE_URL, poolclass=NullPool)
TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


# Create tables before session, drop after
@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.drop_all(bind=test_engine)
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)


# Override get_db
def override_get_db():
    db = TestSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


# Async test client
@pytest_asyncio.fixture()
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


# Register user
@pytest_asyncio.fixture
async def registered_user():
    fake = Faker()

    db = TestSessionLocal()
    user = User(
        username=fake.user_name(), email=fake.email(), password=fake.password(length=12)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    db.close()

    access_token = create_access_token({"sub": user.email})
    headers = {"Authorization": f"Bearer {access_token}"}

    return user, headers


# Register user and create poll
@pytest_asyncio.fixture
async def create_poll_and_user(registered_user):
    fake = Faker()
    events = [
        "Mike Birthday",
        "Emma’s Birthday",
        "Jake & Olivia’s Wedding",
        "Sofia’s Baby Shower",
        "Liam’s New Home Party",
        "Daniel & Grace’s Anniversary",
    ]

    user, headers = registered_user

    db = TestSessionLocal()
    poll = Poll(
        title=f"{fake.first_name()} {random.choice(events)}",
        budget=random.randint(100, 1000),
        user_id=user.id,
    )
    db.add(poll)
    db.commit()
    db.refresh(poll)
    db.close()

    return user, headers, poll


# Register user, create poll and add product
@pytest_asyncio.fixture
async def add_user_poll_and_product(create_poll_and_user):
    fake = Faker()

    user, headers, poll = create_poll_and_user

    db = TestSessionLocal()
    product = Product(
        title=fake.sentence(nb_words=4),
        link=fake.url(),
        image=fake.image_url(),
        rating=round(random.uniform(0, 5), 1),
        price=round(random.uniform(10, 500), 2),
        user_id=user.id,
        poll_id=poll.id,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    db.close()

    return user, product, headers, poll


# Register user, create poll, add product and comment
@pytest_asyncio.fixture
async def add_user_poll_product_and_comment(add_user_poll_and_product):
    fake = Faker()

    user, headers, poll, product = add_user_poll_and_product

    db = TestSessionLocal()
    comment = Comment(
        text=fake.sentence(nb_words=4),
        user_id=user.id,
        product_id=product.id,
        created_by=user.username,
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    db.close()

    return headers, poll, product, comment
