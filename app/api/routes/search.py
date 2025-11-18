from app.utils.products import get_items_test
from fastapi import APIRouter, Depends, Request
from app.core.security import oauth2_scheme


search_router = APIRouter(dependencies=[Depends(oauth2_scheme)])


@search_router.get("/search")
async def read_products_query(search: str):
    """Searching product using Search API"""
    products = get_items_test(search)
    return products
