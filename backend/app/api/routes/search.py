from app.api.schemas.product import ProductSearchOut
from app.services.products import (
    # get_items_from_API,
    get_items_test_json,
)
from fastapi import APIRouter, Depends, Query, Request
from app.core.security import oauth2_scheme
from fastapi.concurrency import run_in_threadpool
from fastapi_pagination import Page, paginate
from datetime import timedelta
import json


search_router = APIRouter(dependencies=[Depends(oauth2_scheme)])


# API
# @search_router.get("/products/search", response_model=Page[ProductSearchOut])
# async def read_products_query(
#     request: Request, search: str = Query(..., min_length=2)
# ) -> Page[ProductSearchOut]:
#     """Searching product using Amazon Search API"""
#     redis = request.app.state.redis

#     cache_key = search

#     cached = await redis.get(cache_key)
#     if cached:
#         return paginate(json.loads(cached))
#     else:
#         products = await run_in_threadpool(get_items_from_API, search)
#         await redis.set(cache_key, json.dumps(products), ex=timedelta(days=1))

#     return paginate(products)


# JSON
@search_router.get("/products/search", response_model=Page[ProductSearchOut])
async def read_products_query(
    request: Request, search: str = Query(..., min_length=2)
) -> Page[ProductSearchOut]:
    """Searching product using Amazon Search API"""
    redis = request.app.state.redis

    cache_key = search

    cached = await redis.get(cache_key)
    if cached:
        return paginate(json.loads(cached))
    else:
        products = await run_in_threadpool(get_items_test_json, search)
        await redis.set(cache_key, json.dumps(products), ex=timedelta(days=1))

    return paginate(products)
