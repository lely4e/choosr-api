from app.api.dependencies import get_vote_manager, get_user_manager, get_comment_manager
from fastapi import APIRouter, Depends, Request
from app.api.services.vote_manager import VoteManager
from app.api.services.user_manager import UserManager
from app.api.services.comment_manager import CommentManager
from app.core.security import oauth2_scheme
from app.api.schemas import CommentIn, CommentOut


comment_router = APIRouter(dependencies=[Depends(oauth2_scheme)])


# add comment to the product
@comment_router.post("/{product_id}/comments", response_model=CommentOut)
async def add_comments(
    request: Request,
    token,
    product_id: int,
    comment_in: CommentIn,
    comment_manager: CommentManager = Depends(get_comment_manager),
    user_manager: UserManager = Depends(get_user_manager),
):
    user = user_manager.get_user_by_email(request.state.user)
    comment = comment_manager.add_comment(token, product_id, user, comment_in)
    return comment


# get comments to the product
@comment_router.get("/{product_id}/comments")
async def get_comments(
    token,
    product_id: int,
    request: Request,
    comment_manager: CommentManager = Depends(get_comment_manager),
    user_manager: UserManager = Depends(get_user_manager),
):
    user = user_manager.get_user_by_email(request.state.user)
    comments = comment_manager.get_comments(token, product_id, user)
    return [dict(row._mapping) for row in comments]


# get comment from the product
@comment_router.get("/{product_id}/comments/{comment_id}")
async def get_comment(
    token,
    product_id: int,
    comment_id: int,
    request: Request,
    comment_manager: CommentManager = Depends(get_comment_manager),
    user_manager: UserManager = Depends(get_user_manager),
):
    user = user_manager.get_user_by_email(request.state.user)
    comments = comment_manager.get_comment(token, product_id, user, comment_id)
    return dict(comments._mapping)


# delete comment from the product
@comment_router.delete("/{product_id}/comments/{comment_id}")
async def delete_comment(
    token,
    product_id: int,
    comment_id: int,
    request: Request,
    comment_manager: CommentManager = Depends(get_comment_manager),
    user_manager: UserManager = Depends(get_user_manager),
):
    user = user_manager.get_user_by_email(request.state.user)
    return comment_manager.delete_comment(token, product_id, user, comment_id)
