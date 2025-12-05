from tests.conftest import TestSessionLocal
from fastapi import status
import pytest
from app.db.models import User
from app.core.security import get_password_hash


@pytest.mark.asyncio
async def test_signup_success(client):
    """Test that user can login with valid credentials"""
    payload = {
        "username": "Lilly",
        "email": "lilly@example.com",
        "password": "kjxnfjd57hg87",
    }
    response = await client.post(
        "/signup",
        json=payload,
    )

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["username"] == "Lilly"
    assert data["email"] == "lilly@example.com"
    assert "created_at" in data

    db = TestSessionLocal()
    user = db.query(User).filter(User.email == data["email"]).first()
    assert user.username == data["username"]
    db.close()


@pytest.mark.asyncio
async def test_signup_user_already_exists(client):
    """Ensure signup fails if the email is already registered"""
    db = TestSessionLocal()
    user = User(username="Mike", email="mike@example.com", password="k888fjd57hg87")
    db.add(user)
    db.commit()
    db.close()

    payload = {
        "username": "Miky",
        "email": "mike@example.com",
        "password": "k888fxmvfkdvkfdjvk7",
    }
    response = await client.post(
        "/signup",
        json=payload,
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() == {"error": "User with this email already exists"}


@pytest.mark.asyncio
async def test_signup_missing_field(client):
    payload = {"username": "Kiki", "email": "kiki@example.com"}
    response = await client.post(
        "/signup",
        json=payload,
    )
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_CONTENT


@pytest.mark.asyncio
async def test_signup_empty_input(client):
    payload = {"username": "", "email": "kiki@example.com", "password": "jjhnjhy565"}
    response = await client.post(
        "/signup",
        json=payload,
    )
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_CONTENT


@pytest.mark.asyncio
async def test_login_success(client):
    db = TestSessionLocal()
    hashed_password = get_password_hash("CorrectPassword")
    user = User(
        username="username", email="user1@example.com", password=hashed_password
    )
    db.add(user)
    db.commit()
    db.close()

    payload = {"username": "user1@example.com", "password": "CorrectPassword"}
    response = await client.post("/auth", data=payload)

    assert response.status_code == status.HTTP_200_OK
    body = response.json()
    assert isinstance(body["access_token"], str)
    assert body["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_login_failed_password_or_username(client):
    db = TestSessionLocal()
    hashed_password = get_password_hash("CorrectPassword")
    user = User(
        username="username", email="user2@example.com", password=hashed_password
    )
    db.add(user)
    db.commit()
    db.close()

    payload = {"username": "user2@example.com", "password": "NotCorrectPassword"}
    response = await client.post("/auth", data=payload)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {"error": "Incorrect username or password"}
