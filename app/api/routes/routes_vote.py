from app.api.dependencies import get_vote_manager, get_user_manager, get_product_manager
from fastapi import APIRouter, Depends, Request
from app.api.services.crud_vote import VoteManager
from app.api.services.crud_user import UserManager
from app.api.services.crud_product import ProductManager
from app.core.security import oauth2_scheme


vote_router = APIRouter(dependencies=[Depends(oauth2_scheme)])


@vote_router.get("/{token}/products/{product_id}/vote")
async def get_votes(
    token,
    product_id: int,
    request: Request,
    vote_manager: VoteManager = Depends(get_vote_manager),
    user_manager: UserManager = Depends(get_user_manager),
    product_manager: ProductManager = Depends(get_product_manager),
):
    user = user_manager.get_user_by_email(request.state.user)
    votes = vote_manager.get_votes_product(token, product_id)
    title = product_manager.get_product(token, product_id)
    return [{"product_id": votes[0][0], "title": title.title, "votes": votes[0][1]}]


# add vote to the product
@vote_router.post("/{token}/products/{product_id}/vote")
async def add_vote(
    token,
    product_id: int,
    request: Request,
    vote_manager: VoteManager = Depends(get_vote_manager),
    user_manager: UserManager = Depends(get_user_manager),
):
    user = user_manager.get_user_by_email(request.state.user)
    return vote_manager.add_vote(token, product_id, user)


# delete vote from the product
@vote_router.delete("/{token}/products/{product_id}/vote")
async def delete_vote(
    token,
    product_id: int,
    request: Request,
    vote_manager: VoteManager = Depends(get_vote_manager),
    user_manager: UserManager = Depends(get_user_manager),
):
    user = user_manager.get_user_by_email(request.state.user)
    return vote_manager.delete_vote(token, product_id, user)
