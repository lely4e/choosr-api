from app.api.schemas import UserIn, UserOut
from app.api.dependencies import get_user_manager
from fastapi import Depends, HTTPException, status, APIRouter, Depends
from app.api.services.user_manager import UserManager
from fastapi.security import OAuth2PasswordRequestForm
from app.api.schemas import Token, UserIn
from app.core.security import create_access_token


auth_router = APIRouter(tags=["Authentication"])


# sign up user (create new account)
@auth_router.post("/signup", response_model=UserOut)
async def sign_up(
    user_in: UserIn, user_manager: UserManager = Depends(get_user_manager)
):
    user = user_manager.sign_up_user(**dict(user_in))
    return user


# sign in (log into an existing account)
# autorize in SwaggerUI doesn't work without this form
@auth_router.post("/auth")
async def sign_in_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    user_manager: UserManager = Depends(get_user_manager),
) -> Token:
    user = user_manager.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email})
    return Token(access_token=access_token, token_type="bearer")
