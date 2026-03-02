from app.api.dependencies import get_user_manager, get_comment_manager
from fastapi import APIRouter, Depends, Request
from app.api.repository.user_manager import UserManager
from app.api.repository.comment_manager import CommentManager
from app.core.security import oauth2_scheme
from app.api.schemas.comments import CommentIn, CommentOut, CommentListOut
from uuid import UUID


comment_router = APIRouter(dependencies=[Depends(oauth2_scheme)])


@comment_router.get("/{product_id}/comments", response_model=list[CommentListOut])
async def get_comments(
    uuid: UUID,
    product_id: int,
    request: Request,
    comment_manager: CommentManager = Depends(get_comment_manager),
    user_manager: UserManager = Depends(get_user_manager),
) -> list[CommentListOut]:
    """Retrieve comments for the selected product"""
    user = user_manager.get_user_by_email(request.state.user)
    comments = comment_manager.get_comments(uuid, product_id, user)
    return comments


@comment_router.post("/{product_id}/comments", response_model=CommentOut)
async def add_comments(
    request: Request,
    uuid: UUID,
    product_id: int,
    comment_in: CommentIn,
    comment_manager: CommentManager = Depends(get_comment_manager),
    user_manager: UserManager = Depends(get_user_manager),
) -> CommentOut:
    """Add a comment to the selected product"""
    user = user_manager.get_user_by_email(request.state.user)
    comment = comment_manager.add_comment(uuid, product_id, user, comment_in)
    return comment


@comment_router.get(
    "/{product_id}/comments/{comment_id}", response_model=CommentListOut
)
async def get_comment(
    uuid: UUID,
    product_id: int,
    comment_id: int,
    request: Request,
    comment_manager: CommentManager = Depends(get_comment_manager),
    user_manager: UserManager = Depends(get_user_manager),
) -> CommentListOut:
    """Retrieve a specific comment for the selected product"""
    user = user_manager.get_user_by_email(request.state.user)
    comments = comment_manager.get_comment(uuid, product_id, user, comment_id)
    return comments


@comment_router.delete("/{product_id}/comments/{comment_id}")
async def delete_comment(
    uuid: UUID,
    product_id: int,
    comment_id: int,
    request: Request,
    comment_manager: CommentManager = Depends(get_comment_manager),
    user_manager: UserManager = Depends(get_user_manager),
):
    """Delete a specific comment for the selected product"""
    user = user_manager.get_user_by_email(request.state.user)
    return comment_manager.delete_comment(uuid, product_id, user, comment_id)
