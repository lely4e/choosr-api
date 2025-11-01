from app.api.schemas import ProductIn, ProductOut, ProductAddJSON
from typing import List
from app.api.dependencies import get_product_manager
from fastapi import APIRouter, Depends, Form
from app.api.services.crud_product import ProductManager
import requests


product_router = APIRouter()


# get all products
@product_router.get("/{token}/products", response_model=List[ProductOut])
async def show_products(
    token, product_manager: ProductManager = Depends(get_product_manager)
):
    products = product_manager.get_products(token)
    return products


# add product
@product_router.post("/{token}/products", response_model=ProductOut)
async def add_product(
    token,
    product_in: ProductAddJSON,
    product_manager: ProductManager = Depends(get_product_manager),
):
    return product_manager.add_product(token, product_in)


# add product link
@product_router.post("/{token}/product", response_model=ProductOut)
async def add_product(
    token,
    product_in: ProductIn,
    product_manager: ProductManager = Depends(get_product_manager),
):
    return product_manager.add_product_link(token, product_in)


# get product
@product_router.get("/{token}/products/{product_id}", response_model=ProductOut)
async def read_product(
    token, product_id, product_manager: ProductManager = Depends(get_product_manager)
):
    product = product_manager.get_product(token, product_id)
    return product


# delete product
@product_router.delete("/{token}/products/{product_id}")
async def delete_product(
    token, product_id, product_manager: ProductManager = Depends(get_product_manager)
):
    product_manager.delete_product(token, product_id)
    return {"message": "Product was deleted successfully"}
