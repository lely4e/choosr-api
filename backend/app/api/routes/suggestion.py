from app.api.schemas.suggest import SuggestIn
from app.api.dependencies import get_user_manager
from fastapi import APIRouter, Depends, Request
from app.api.repository.user_manager import UserManager
from app.services.suggestion import ai_prompt
from app.core.security import oauth2_scheme
from fastapi.concurrency import run_in_threadpool
from app.core.limiter import limiter


suggestion_router = APIRouter(dependencies=[Depends(oauth2_scheme)])


@suggestion_router.post("/products/suggestion")
@limiter.limit("10/minute")
async def suggest(
    request: Request,
    suggest_in: SuggestIn,
    user_manager: UserManager = Depends(get_user_manager),
):
    """Form for user to get gift suggestions from AI."""
    # user = user_manager.get_user_by_email(request.state.user)
    suggestion = await run_in_threadpool(
        ai_prompt,
        suggest_in.event_type,
        suggest_in.recipient_relation,
        suggest_in.recipient_age,
        suggest_in.recipient_hobbies,
        suggest_in.gift_type,
        suggest_in.budget_range,
    )
    return suggestion
