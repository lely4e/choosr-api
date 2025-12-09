from tests.conftest import TestSessionLocal
from fastapi import status
import pytest
from app.db.models import Product, Poll, Comment, Vote


@pytest.mark.asyncio
async def test_add_vote_success(client, add_user_poll_and_product):
    user, product, headers, poll = add_user_poll_and_product

    response = await client.post(
        f"/{poll.uuid}/products/{product.id}/vote", headers=headers
    )

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["product_id"] == product.id
    assert data["user_id"] == user.id


@pytest.mark.asyncio
async def test_add_vote_failed_vote_only_once(client, add_user_poll_and_product):
    user, product, headers, poll = add_user_poll_and_product

    response1 = await client.post(
        f"/{poll.uuid}/products/{product.id}/vote", headers=headers
    )

    response2 = await client.post(
        f"/{poll.uuid}/products/{product.id}/vote", headers=headers
    )

    assert response2.status_code == status.HTTP_200_OK
    data = response2.json()

    assert data == {"message": "You can vote only once"}


@pytest.mark.asyncio
async def test_add_vote_failed_missing_token(client, add_user_poll_and_product):
    _, product, _, poll = add_user_poll_and_product

    response = await client.post(f"/{poll.uuid}/products/{product.id}/vote")

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {"detail": "Missing token"}


@pytest.mark.asyncio
async def test_get_vote_success(client, add_user_poll_and_product):
    user, product, headers, poll = add_user_poll_and_product

    db = TestSessionLocal()
    vote = Vote(
        user_id=user.id,
        product_id=product.id,
    )
    db.add(vote)
    db.commit()
    db.refresh(vote)
    db.close()

    response = await client.get(
        f"/{poll.uuid}/products/{product.id}/vote", headers=headers
    )

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["user_id"] == vote.user_id
    assert data["product_id"] == vote.product_id


@pytest.mark.asyncio
async def test_delete_vote_success(client, add_user_poll_and_product):
    user, product, headers, poll = add_user_poll_and_product

    db = TestSessionLocal()
    vote = Vote(
        user_id=user.id,
        product_id=product.id,
    )
    db.add(vote)
    db.commit()
    db.refresh(vote)
    db.close()

    response = await client.delete(
        f"/{poll.uuid}/products/{product.id}/vote", headers=headers
    )

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data == {"message": "Vote was deleted successfully"}


@pytest.mark.asyncio
async def test_delete_vote_failed(client, add_user_poll_and_product):
    user, product, headers, poll = add_user_poll_and_product
    product.id += 1

    response = await client.delete(
        f"/{poll.uuid}/products/{product.id}/vote", headers=headers
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND
    data = response.json()
    assert data == {"error": "Product not found"}
