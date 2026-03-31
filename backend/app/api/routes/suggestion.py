from app.api.schemas.suggestion import SuggestIn, SuggestOut, HistoryOut
from app.api.dependencies import get_user_manager, get_history_manager
from fastapi import APIRouter, Depends, Request
from app.api.repository.user_manager import UserManager
from app.api.repository.history_manager import HistoryManager
from app.services.suggestion import ai_prompt
from app.core.security import oauth2_scheme
from fastapi.concurrency import run_in_threadpool
from app.core.limiter import limiter
from uuid import UUID
from typing import List


suggestion_router = APIRouter(dependencies=[Depends(oauth2_scheme)])


@suggestion_router.get("/polls/products/suggestion", response_model=List[HistoryOut])
async def get_suggestions_history(
    request: Request,
    user_manager: UserManager = Depends(get_user_manager),
    history_manager: HistoryManager = Depends(get_history_manager),
):
    """Retrieve gift suggestions history"""
    user = user_manager.get_user_by_email(request.state.user)
    return history_manager.get_history(user)


@suggestion_router.get(
    "/polls/{uuid}/products/suggestion", response_model=List[HistoryOut]
)
async def get_suggestion_history(
    request: Request,
    uuid: UUID,
    user_manager: UserManager = Depends(get_user_manager),
    history_manager: HistoryManager = Depends(get_history_manager),
):
    """Retrieve gift suggestions history"""
    user = user_manager.get_user_by_email(request.state.user)
    return history_manager.get_history_by_uuid(user, uuid)


@suggestion_router.get(
    "/polls/{uuid}/products/suggestion/{history_id}", response_model=HistoryOut
)
async def get_suggestions_history_by_id(
    request: Request,
    uuid: UUID,
    history_id: int,
    user_manager: UserManager = Depends(get_user_manager),
    history_manager: HistoryManager = Depends(get_history_manager),
):
    """Retrieve gift suggestions history by id"""
    user = user_manager.get_user_by_email(request.state.user)
    return history_manager.get_history_by_id(user, history_id, uuid)


@suggestion_router.post("/polls/{uuid}/products/suggestion")
@limiter.limit("10/minute")
async def suggest(
    request: Request,
    uuid: UUID,
    suggest_in: SuggestIn,
    user_manager: UserManager = Depends(get_user_manager),
    history_manager: HistoryManager = Depends(get_history_manager),
):
    """Form for user to get gift suggestions from AI."""
    user = user_manager.get_user_by_email(request.state.user)
    suggestions = await run_in_threadpool(
        ai_prompt,
        suggest_in.event_type,
        suggest_in.recipient_relation,
        suggest_in.recipient_age,
        suggest_in.recipient_hobbies,
        suggest_in.gift_type,
        suggest_in.budget_range,
    )

    for item in suggestions:
        history_manager.add_history(user, item, uuid)

    return suggestions


@suggestion_router.delete(
    "/polls/{uuid}/products/suggestion/{history_id}", response_model=HistoryOut
)
async def delete_history(
    request: Request,
    uuid: UUID,
    history_id: int,
    user_manager: UserManager = Depends(get_user_manager),
    history_manager: HistoryManager = Depends(get_history_manager),
):
    """Allow the creator to delete ideas search history using it's id"""
    user = user_manager.get_user_by_email(request.state.user)
    return history_manager.delete_history(user, history_id, uuid)
