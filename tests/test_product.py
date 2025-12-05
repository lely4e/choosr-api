from tests.conftest import TestSessionLocal
from fastapi import status
import pytest
from app.db.models import Product, Poll


@pytest.mark.asyncio
async def test_add_product_success(client, create_poll_and_user):
    user, headers, poll = create_poll_and_user

    payload = {
        "title": "Amazon bluetooth speaker",
        "link": "https://www.amazon.com/Amazon-Echo-Dot-Max-Alexa-Speaker-Glacier-White-Amazon/dp/B0D6SZKGT4/ref=sr_1_1_ffob_sspa?dib=eyJ2IjoiMSJ9.MtQEATNtlwXkZ_XS7vPloaySVAZuPmcpMJ14mXQKCKMVnubGW_ZaLjEaoEw6lzF4Vcx-TrZdO1V-6RaUdcBS7wOFPp2-VEXnGS2wXPju3eysMurtC2rvH0aSsKceSMppb2QkPhV36o92P0XEDG5hGEze7W-nLHSGg32fwS5JAxOXDxguZmzCdwzYRsKbD8ci6MxadSqWJjBdJe60oPHnL1gjmDLaAYb_OWXLP_Phw_Q.nwnjL3WNfX8eNyyEtWW-PEEM7OZk53BG1PXeILH7cfY&dib_tag=se&keywords=bluetooth speaker&qid=1762765734&sr=8-1-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1",
        "image": "https://m.media-amazon.com/images/I/71spM0xjLoL._AC_UY218_.jpg",
        "rating": 3.8,
        "price": 99.99,
    }
    response = await client.post(
        f"/{poll.uuid}/products", headers=headers, json=payload
    )

    assert response.status_code == status.HTTP_200_OK
    data = response.json()

    db = TestSessionLocal()
    product = db.query(Product).filter(Product.poll_id == poll.id).first()
    assert data["title"] == product.title
    assert data["link"] == product.link
    assert data["image"] == product.image
    assert data["rating"] == product.rating
    assert data["price"] == product.price
    db.close()


@pytest.mark.asyncio
async def test_add_product_failed_empty_data(client, create_poll_and_user):
    user, headers, poll = create_poll_and_user

    payload = {}
    response = await client.post(
        f"/{poll.uuid}/products", headers=headers, json=payload
    )

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_CONTENT


@pytest.mark.asyncio
async def test_add_product_failed_empty_title(client, create_poll_and_user):
    user, headers, poll = create_poll_and_user

    payload = {
        "title": "",
        "link": "https://www.amazon.com/Amazon-Echo-Dot-Max-Alexa-Speaker-Glacier-White-Amazon/dp/B0D6SZKGT4/ref=sr_1_1_ffob_sspa?dib=eyJ2IjoiMSJ9.MtQEATNtlwXkZ_XS7vPloaySVAZuPmcpMJ14mXQKCKMVnubGW_ZaLjEaoEw6lzF4Vcx-TrZdO1V-6RaUdcBS7wOFPp2-VEXnGS2wXPju3eysMurtC2rvH0aSsKceSMppb2QkPhV36o92P0XEDG5hGEze7W-nLHSGg32fwS5JAxOXDxguZmzCdwzYRsKbD8ci6MxadSqWJjBdJe60oPHnL1gjmDLaAYb_OWXLP_Phw_Q.nwnjL3WNfX8eNyyEtWW-PEEM7OZk53BG1PXeILH7cfY&dib_tag=se&keywords=bluetooth speaker&qid=1762765734&sr=8-1-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1",
        "image": "https://m.media-amazon.com/images/I/71spM0xjLoL._AC_UY218_.jpg",
        "rating": 3.8,
        "price": 99.99,
    }
    response = await client.post(
        f"/{poll.uuid}/products", headers=headers, json=payload
    )

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_CONTENT


@pytest.mark.asyncio
async def test_add_product_failed_empty_price(client, create_poll_and_user):
    user, headers, poll = create_poll_and_user

    payload = {
        "title": "Amazon Echo",
        "link": "https://www.amazon.com/Amazon-Echo-Dot-Max-Alexa-Speaker-Glacier-White-Amazon/dp/B0D6SZKGT4/ref=sr_1_1_ffob_sspa?dib=eyJ2IjoiMSJ9.MtQEATNtlwXkZ_XS7vPloaySVAZuPmcpMJ14mXQKCKMVnubGW_ZaLjEaoEw6lzF4Vcx-TrZdO1V-6RaUdcBS7wOFPp2-VEXnGS2wXPju3eysMurtC2rvH0aSsKceSMppb2QkPhV36o92P0XEDG5hGEze7W-nLHSGg32fwS5JAxOXDxguZmzCdwzYRsKbD8ci6MxadSqWJjBdJe60oPHnL1gjmDLaAYb_OWXLP_Phw_Q.nwnjL3WNfX8eNyyEtWW-PEEM7OZk53BG1PXeILH7cfY&dib_tag=se&keywords=bluetooth speaker&qid=1762765734&sr=8-1-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1",
        "image": "https://m.media-amazon.com/images/I/71spM0xjLoL._AC_UY218_.jpg",
        "rating": 3.8,
        "price": None,
    }
    response = await client.post(
        f"/{poll.uuid}/products", headers=headers, json=payload
    )

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_CONTENT


@pytest.mark.asyncio
async def test_get_product_success(client, add_user_poll_and_product):
    user, product, headers, poll = add_user_poll_and_product

    response = await client.get(f"/{poll.uuid}/products/{product.id}", headers=headers)

    assert response.status_code == status.HTTP_200_OK
    data = response.json()

    # db = TestSessionLocal()
    # product = db.query(Product).filter(Product.poll_id == poll.id).first()
    assert data["title"] == product.title
    assert data["link"] == product.link
    assert data["image"] == product.image
    assert data["rating"] == product.rating
    assert data["price"] == product.price
    # db.close()


@pytest.mark.asyncio
async def test_get_products_success(client, add_user_poll_and_product):
    user, product, headers, poll = add_user_poll_and_product

    response = await client.get(f"/{poll.uuid}/products", headers=headers)

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    # db = TestSessionLocal()
    # product = db.query(Product).filter(Product.poll_id == poll.id).first()
    assert data[0]["title"] == product.title
    assert data[0]["link"] == product.link
    assert data[0]["image"] == product.image
    assert data[0]["rating"] == product.rating
    assert data[0]["price"] == product.price
    assert data[0]["votes"] == 0
    # db.close()


@pytest.mark.asyncio
async def test_delete_product_success(client, add_user_poll_and_product):
    user, product, headers, poll = add_user_poll_and_product

    response = await client.delete(
        f"/{poll.uuid}/products/{product.id}", headers=headers
    )

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data == {"message": "Product was deleted successfully"}

    # db = TestSessionLocal()
    # product_delete = db.query(Product).filter(Product.id == product.id).first()
    # assert product_delete is None
    # db.close()
