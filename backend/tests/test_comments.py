from tests.conftest import TestSessionLocal
from fastapi import status
import pytest
from app.db.models import Product, Poll, Comment


@pytest.mark.asyncio
async def test_add_comment_success(client, add_user_poll_and_product):
    user, product, headers, poll = add_user_poll_and_product

    payload = {
        "text": "I like this very much!",
    }

    response = await client.post(
        f"/{poll.uuid}/products/{product.id}/comments", headers=headers, json=payload
    )

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    db = TestSessionLocal()
    comment = (
        db.query(Comment)
        .join(Product, Comment.product_id == product.id)
        .join(Poll, Product.poll_id == Poll.id)
        .first()
    )
    assert data["text"] == comment.text
    db.close()


@pytest.mark.asyncio
async def test_add_comment_failed_empty_text(client, add_user_poll_and_product):
    user, product, headers, poll = add_user_poll_and_product

    payload = {
        "text": "",
    }

    response = await client.post(
        f"/{poll.uuid}/products/{product.id}/comments", headers=headers, json=payload
    )

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_CONTENT
    data = response.json()
    assert data == {
        "error": "Validation failed",
        "details": [
            {
                "type": "string_too_short",
                "loc": ["body", "text"],
                "msg": "String should have at least 3 characters",
                "input": "",
                "ctx": {"min_length": 3},
            }
        ],
    }


@pytest.mark.asyncio
async def test_add_comment_failed_no_product(client, add_user_poll_and_product):
    user, product, headers, poll = add_user_poll_and_product
    product.id += 1
    payload = {
        "text": "I like this",
    }

    response = await client.post(
        f"/{poll.uuid}/products/{product.id}/comments", headers=headers, json=payload
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND
    data = response.json()
    assert data == {"error": "Product not found"}


@pytest.mark.asyncio
async def test_add_comment_failed_no_user(client, add_user_poll_and_product):
    _, product, _, poll = add_user_poll_and_product

    payload = {
        "text": "I like this!",
    }

    response = await client.post(
        f"/{poll.uuid}/products/{product.id}/comments", json=payload
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    data = response.json()


@pytest.mark.asyncio
async def test_get_comments_success(client, add_user_poll_product_and_comment):
    product, headers, poll, comment = add_user_poll_product_and_comment
    response = await client.get(
        f"/{poll.uuid}/products/{product.id}/comments", headers=headers
    )

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data[0]["text"] == comment.text


@pytest.mark.asyncio
async def test_get_comment_by_id_success(client, add_user_poll_product_and_comment):
    product, headers, poll, comment = add_user_poll_product_and_comment
    response = await client.get(
        f"/{poll.uuid}/products/{product.id}/comments/{comment.id}", headers=headers
    )

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["text"] == comment.text


@pytest.mark.asyncio
async def test_delete_comment_by_id_success(client, add_user_poll_product_and_comment):
    product, headers, poll, comment = add_user_poll_product_and_comment
    response = await client.delete(
        f"/{poll.uuid}/products/{product.id}/comments/{comment.id}", headers=headers
    )

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data == {"message": "Comment was deleted successfully"}


@pytest.mark.asyncio
async def test_delete_comment_by_id_failed(client, add_user_poll_product_and_comment):
    product, headers, poll, comment = add_user_poll_product_and_comment
    comment.id += 1
    response = await client.delete(
        f"/{poll.uuid}/products/{product.id}/comments/{comment.id}", headers=headers
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND
    data = response.json()
    assert data == {"error": "Comment not found"}


@pytest.mark.asyncio
async def test_delete_comment_by_id_failed_no_product(
    client, add_user_poll_product_and_comment
):
    product, headers, poll, comment = add_user_poll_product_and_comment
    product.id += 1
    response = await client.delete(
        f"/{poll.uuid}/products/{product.id}/comments/{comment.id}", headers=headers
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND
    data = response.json()
    assert data == {"error": "Product not found"}
