from app.api.schemas.product import ProductSearchOut
from app.services.products import (
    # get_items_test,
    # get_items_from_API,
    get_items_test_json,
)
from fastapi import APIRouter, Depends, Query
from app.core.security import oauth2_scheme
from fastapi.concurrency import run_in_threadpool
from fastapi_pagination import Page, paginate


search_router = APIRouter(dependencies=[Depends(oauth2_scheme)])


# @search_router.get("/products/search", response_model=list[ProductSearchOut])
# async def read_products_query(
#     search: str = Query(..., min_length=2)
# ) -> ProductSearchOut:
#     """Searching product using Amazon Search API"""
#     products = await run_in_threadpool(get_items_from_API, search)
#     return products


# @search_router.get("/products/search", response_model=Page[ProductSearchOut])
# async def read_products_query(
#     search: str = Query(..., min_length=2)
# ) -> Page[ProductSearchOut]:
#     """Searching product using Amazon Search API"""
#     products = await run_in_threadpool(get_items_test, search)
#     return paginate(products)


# json
@search_router.get("/products/search", response_model=Page[ProductSearchOut])
async def read_products_query(
    search: str = Query(..., min_length=2)
) -> Page[ProductSearchOut]:
    """Searching product using Amazon Search API"""
    products = await run_in_threadpool(get_items_test_json, search)
    return paginate(products)
