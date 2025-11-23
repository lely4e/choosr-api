from app.api.dependencies import get_user_manager, get_comment_manager
from fastapi import APIRouter, Depends, Request
from app.api.repository.user_manager import UserManager
from app.api.repository.comment_manager import CommentManager
from app.core.security import oauth2_scheme
from app.api.schemas.comments import CommentIn, CommentOut


comment_router = APIRouter(dependencies=[Depends(oauth2_scheme)])


@comment_router.get("/{product_id}/comments")
async def get_comments(
    token,
    product_id: int,
    request: Request,
    comment_manager: CommentManager = Depends(get_comment_manager),
    user_manager: UserManager = Depends(get_user_manager),
):
    """Retrieve comments for the selected product"""
    user = user_manager.get_user_by_email(request.state.user)
    comments = comment_manager.get_comments(token, product_id, user)
    return [dict(row._mapping) for row in comments]


@comment_router.post("/{product_id}/comments", response_model=CommentOut)
async def add_comments(
    request: Request,
    token,
    product_id: int,
    comment_in: CommentIn,
    comment_manager: CommentManager = Depends(get_comment_manager),
    user_manager: UserManager = Depends(get_user_manager),
):
    """Add a comment to the selected product"""
    user = user_manager.get_user_by_email(request.state.user)
    comment = comment_manager.add_comment(token, product_id, user, comment_in)
    return comment


@comment_router.get("/{product_id}/comments/{comment_id}")
async def get_comment(
    token,
    product_id: int,
    comment_id: int,
    request: Request,
    comment_manager: CommentManager = Depends(get_comment_manager),
    user_manager: UserManager = Depends(get_user_manager),
):
    """Retrieve a specific comment for the selected product"""
    user = user_manager.get_user_by_email(request.state.user)
    comments = comment_manager.get_comment(token, product_id, user, comment_id)
    return dict(comments._mapping)


@comment_router.delete("/{product_id}/comments/{comment_id}")
async def delete_comment(
    token,
    product_id: int,
    comment_id: int,
    request: Request,
    comment_manager: CommentManager = Depends(get_comment_manager),
    user_manager: UserManager = Depends(get_user_manager),
):
    """Delete a specific comment for the selected product"""
    user = user_manager.get_user_by_email(request.state.user)
    return comment_manager.delete_comment(token, product_id, user, comment_id)
