from tests.conftest import TestSessionLocal
from fastapi import status
import pytest
from app.db.models import User


@pytest.mark.asyncio
async def test_get_current_user_success(client, registered_user):
    user, headers = registered_user
    response = await client.get("/me", headers=headers)

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["email"] == user.email
    assert data["username"] == user.username


@pytest.mark.asyncio
async def test_get_current_user_invalid_token(client):
    headers = {"Authorization": f"Bearer Invalid-bearer"}
    response = await client.get("/me", headers=headers)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {"detail": "Invalid token"}


@pytest.mark.asyncio
async def test_get_current_user_missing_token(client):
    response = await client.get("/me")

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {"detail": "Missing token"}


@pytest.mark.asyncio
async def test_update_current_user_username_success(client, registered_user):
    user, headers = registered_user

    payload = {"username": "John Doe"}

    response = await client.put("/me", headers=headers, json=payload)

    assert response.status_code == status.HTTP_200_OK
    data = response.json()

    assert data["username"] == "John Doe"

    db = TestSessionLocal()
    user_update = db.query(User).filter_by(email=user.email).first()
    assert user_update.username == "John Doe"
    db.close()


@pytest.mark.asyncio
async def test_update_current_user_username_failed(client, registered_user):
    user, headers = registered_user

    payload = {}

    response = await client.put("/me", headers=headers, json=payload)

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_CONTENT


@pytest.mark.asyncio
async def test_delete_current_user_username_success(client, registered_user):
    user, headers = registered_user
    response = await client.delete("/me", headers=headers)

    assert response.status_code == status.HTTP_200_OK

    db = TestSessionLocal()
    user_deleted = db.query(User).filter_by(email=user.email).first()
    assert user_deleted is None
    db.close()
