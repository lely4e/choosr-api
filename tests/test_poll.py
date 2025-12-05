from tests.conftest import TestSessionLocal
from fastapi import status
import pytest
from app.db.models import Poll


@pytest.mark.asyncio
async def test_create_poll_success(client, registered_user):
    user, headers = registered_user

    payload = {
        "title": "Mike Birthday",
        "budget": 350,
        "user_id": user.id,
    }
    response = await client.post("/polls", headers=headers, json=payload)

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["title"] == "Mike Birthday"
    assert data["budget"] == 350
    assert "uuid" in data
    assert "created_at" in data


@pytest.mark.asyncio
async def test_create_poll_failed_missing_token(client):
    payload = {"title": "Mike Birthday", "budget": 350}
    response = await client.post("/polls", json=payload)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {"detail": "Missing token"}


@pytest.mark.asyncio
async def test_create_poll_failed_mising_field(client, registered_user):
    user, headers = registered_user

    payload = {"title": "Mike Birthday"}
    response = await client.post("/polls", headers=headers, json=payload)

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_CONTENT
    assert response.json() == {
        "error": "Validation failed",
        "details": [
            {
                "type": "missing",
                "loc": ["body", "budget"],
                "msg": "Field required",
                "input": {"title": "Mike Birthday"},
            }
        ],
    }


@pytest.mark.asyncio
async def test_get_poll_success(client, create_poll_and_user):
    user, headers, poll = create_poll_and_user
    response = await client.get("/polls", headers=headers)

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data[0]["title"] == poll.title
    assert data[0]["budget"] == poll.budget
    assert data[0]["uuid"] == str(poll.uuid)
    assert "created_at" in data[0]


@pytest.mark.asyncio
async def test_get_poll_uuid_success(client, create_poll_and_user):
    user, headers, poll = create_poll_and_user
    response = await client.get(f"/{poll.uuid}", headers=headers)

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["title"] == poll.title
    assert data["budget"] == poll.budget
    assert data["uuid"] == str(poll.uuid)
    assert "created_at" in data


@pytest.mark.asyncio
async def test_update_poll_uuid_success(client, create_poll_and_user):
    user, headers, poll = create_poll_and_user

    payload = {"title": "John Home Party", "budget": 560}
    response = await client.put(f"/{poll.uuid}", headers=headers, json=payload)

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["title"] == "John Home Party"
    assert data["budget"] == 560

    db = TestSessionLocal()
    poll_update = db.query(Poll).filter_by(uuid=poll.uuid).first()
    assert poll_update.title == "John Home Party"
    assert poll_update.budget == 560
    db.close()


@pytest.mark.asyncio
async def test_update_poll_uuid_failed_empty_fields(client, create_poll_and_user):
    user, headers, poll = create_poll_and_user

    payload = {"title": "", "budget": 560}
    response = await client.put(f"/{poll.uuid}", headers=headers, json=payload)

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_CONTENT


@pytest.mark.asyncio
async def test_update_poll_uuid_failed_not_correct_fields(client, create_poll_and_user):
    user, headers, poll = create_poll_and_user

    payload = {
        "titled": "Bla",
        "budget": 560,
    }
    response = await client.put(f"/{poll.uuid}", headers=headers, json=payload)

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_CONTENT
    assert response.json() == {
        "error": "Validation failed",
        "details": [
            {
                "type": "missing",
                "loc": ["body", "title"],
                "msg": "Field required",
                "input": {"titled": "Bla", "budget": 560},
            }
        ],
    }


@pytest.mark.asyncio
async def test_delete_poll_uuid_success(client, create_poll_and_user):
    user, headers, poll = create_poll_and_user
    response = await client.delete(f"/{poll.uuid}", headers=headers)

    assert response.status_code == status.HTTP_200_OK

    db = TestSessionLocal()
    poll_delete = db.query(Poll).filter_by(uuid=poll.uuid).first()
    assert poll_delete is None
    db.close()
