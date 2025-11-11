from app.api.schemas import ProductAddJSON, ProductFull
from app.api.dependencies import get_product_manager, get_user_manager, get_vote_manager
from fastapi import APIRouter, Depends, Request
from app.api.services.product_manager import ProductManager
from app.api.services.vote_manager import VoteManager
from app.api.services.user_manager import UserManager
from app.core.security import oauth2_scheme
from app.utils.products import get_items_test


product_router = APIRouter(dependencies=[Depends(oauth2_scheme)])


# get all products
@product_router.get("/products")
async def get_products(
    token,
    request: Request,
    vote_manager: VoteManager = Depends(get_vote_manager),
    user_manager: UserManager = Depends(get_user_manager),
):
    user = user_manager.get_user_by_email(request.state.user)
    votes = vote_manager.get_products_with_votes(token)
    return [dict(row._mapping) for row in votes]


# get products from Amazon API by searching
@product_router.get("/products/search")
async def read_products_query(search: str):
    products = get_items_test(search)
    return products


# add product as JSON
@product_router.post("/products/search", response_model=ProductFull)
async def add_product(
    token,
    request: Request,
    product_in: ProductAddJSON,
    product_manager: ProductManager = Depends(get_product_manager),
    user_manager: UserManager = Depends(get_user_manager),
):
    user = user_manager.get_user_by_email(request.state.user)
    return product_manager.add_product(token, product_in, user)


# get product
@product_router.get("/products/{product_id}", response_model=ProductFull)
async def read_product(
    token, product_id, product_manager: ProductManager = Depends(get_product_manager)
):
    product = product_manager.get_product(token, product_id)
    return product


# delete product
@product_router.delete("/products/{product_id}")
async def delete_product(
    request: Request,
    token,
    product_id,
    product_manager: ProductManager = Depends(get_product_manager),
    user_manager: UserManager = Depends(get_user_manager),
):
    user = user_manager.get_user_by_email(request.state.user)
    product_manager.delete_product(token, product_id, user)
    return {"message": "Product was deleted successfully"}
