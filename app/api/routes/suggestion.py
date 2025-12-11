from app.api.schemas.poll import PollIn, PollOut
from app.api.schemas.suggest import SuggestIn
from app.api.dependencies import get_user_manager, get_poll_manager
from fastapi import APIRouter, Depends, Request
from app.api.repository.user_manager import UserManager
from app.api.repository.poll_manager import PollManager
from app.services.suggestion import ai_prompt
from app.core.security import oauth2_scheme


suggestion_router = APIRouter(dependencies=[Depends(oauth2_scheme)])


@suggestion_router.post("/products/suggestion")
async def suggest(
    request: Request,
    suggest_in: SuggestIn,
    user_manager: UserManager = Depends(get_user_manager),
):
    """Add a poll created by the current user"""
    # user = user_manager.get_user_by_email(request.state.user)
    suggestion = ai_prompt(
        suggest_in.event_type,
        suggest_in.recipient_relation,
        suggest_in.recipient_age,
        suggest_in.recipient_hobbies,
        suggest_in.gift_type,
        suggest_in.budget_range,
    )
    return suggestion
