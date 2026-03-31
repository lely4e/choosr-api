from app.api.schemas.idea import IdeaIn, IdeaOut, IdeaUpdate
from app.api.dependencies import get_user_manager, get_history_manager, get_idea_manager
from fastapi import APIRouter, Depends, Request
from app.api.repository.user_manager import UserManager
from app.api.repository.history_manager import HistoryManager
from app.api.repository.idea_manager import IdeaManager
from app.core.security import oauth2_scheme
from typing import List
from uuid import UUID


idea_router = APIRouter(dependencies=[Depends(oauth2_scheme)])


@idea_router.get("/ideas")
async def get_ideas(
    request: Request,
    user_manager: UserManager = Depends(get_user_manager),
    idea_manager: IdeaManager = Depends(get_idea_manager),
    q: str | None = None,
):
    """Retrieve all Ideas from current user"""
    user = user_manager.get_user_by_email(request.state.user)
    if q:
        return idea_manager.get_ideas(user.id, q)
    return idea_manager.get_ideas(user.id)


@idea_router.get("/ideas/{idea_id}", response_model=IdeaOut)
async def get_idea_by_id(
    request: Request,
    idea_id: int,
    user_manager: UserManager = Depends(get_user_manager),
    idea_manager: IdeaManager = Depends(get_idea_manager),
):
    """Retrieve an Idea from current user by id"""
    user = user_manager.get_user_by_email(request.state.user)
    return idea_manager.get_idea(user, idea_id)


@idea_router.post("/ideas")
async def add_idea(
    request: Request,
    idea_in: IdeaIn,
    user_manager: UserManager = Depends(get_user_manager),
    history_manager: HistoryManager = Depends(get_history_manager),
    idea_manager: IdeaManager = Depends(get_idea_manager),
):
    """Add an Idea"""
    user = user_manager.get_user_by_email(request.state.user)
    return idea_manager.add_idea(user.id, idea_in)


@idea_router.post("/polls/{uuid}/ideas/{history_id}")
async def add_idea_from_history(
    request: Request,
    uuid: UUID,
    # idea_in: IdeaIn,
    history_id: int,
    user_manager: UserManager = Depends(get_user_manager),
    history_manager: HistoryManager = Depends(get_history_manager),
    idea_manager: IdeaManager = Depends(get_idea_manager),
):
    """Add an Idea"""
    user = user_manager.get_user_by_email(request.state.user)
    return idea_manager.add_idea_from_history(user, uuid, history_id)


@idea_router.patch("/ideas/{idea_id}", response_model=IdeaOut)
async def update_idea(
    request: Request,
    idea_id: int,
    idea_in: IdeaUpdate,
    user_manager: UserManager = Depends(get_user_manager),
    idea_manager: IdeaManager = Depends(get_idea_manager),
):
    """Update Idea"""
    user = user_manager.get_user_by_email(request.state.user)
    return idea_manager.update_idea(user.id, idea_id, idea_in)


@idea_router.delete("/ideas/{idea_id}", response_model=IdeaOut)
async def delete_idea(
    request: Request,
    idea_id: int,
    user_manager: UserManager = Depends(get_user_manager),
    idea_manager: IdeaManager = Depends(get_idea_manager),
):
    """Delete Idea using it's id"""
    user = user_manager.get_user_by_email(request.state.user)
    return idea_manager.delete_idea(user.id, idea_id)
