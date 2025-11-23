from app.api.schemas.product import ProductAddJSON, ProductFull
from app.api.dependencies import get_product_manager, get_user_manager, get_vote_manager
from fastapi import APIRouter, Depends, Request
from app.api.repository.product_manager import ProductManager
from app.api.repository.vote_manager import VoteManager
from app.api.repository.user_manager import UserManager
from app.core.security import oauth2_scheme


product_router = APIRouter(dependencies=[Depends(oauth2_scheme)])


@product_router.get("/products")
async def get_products(
    token,
    request: Request,
    vote_manager: VoteManager = Depends(get_vote_manager),
    user_manager: UserManager = Depends(get_user_manager),
):
    """Retrieve all products from the selected poll"""
    user = user_manager.get_user_by_email(request.state.user)
    votes = vote_manager.get_products_with_votes(token)
    return [dict(row._mapping) for row in votes]


@product_router.post("/products", response_model=ProductFull)
async def add_product(
    token,
    request: Request,
    product_in: ProductAddJSON,
    product_manager: ProductManager = Depends(get_product_manager),
    user_manager: UserManager = Depends(get_user_manager),
):
    """Add a product in JSON format"""
    user = user_manager.get_user_by_email(request.state.user)
    return product_manager.add_product(token, product_in, user)


@product_router.get("/products/{product_id}", response_model=ProductFull)
async def read_product(
    token, product_id, product_manager: ProductManager = Depends(get_product_manager)
):
    """Retrieve a specific product from the selected poll"""
    product = product_manager.get_product(token, product_id)
    return product


@product_router.delete("/products/{product_id}")
async def delete_product(
    request: Request,
    token,
    product_id,
    product_manager: ProductManager = Depends(get_product_manager),
    user_manager: UserManager = Depends(get_user_manager),
):
    """Delete a specific product from the selected poll"""
    user = user_manager.get_user_by_email(request.state.user)
    product_manager.delete_product(token, product_id, user)
    return {"message": "Product was deleted successfully"}
