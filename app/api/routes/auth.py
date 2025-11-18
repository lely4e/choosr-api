from app.api.schemas.user import UserIn, UserOut
from app.api.dependencies import get_user_manager
from fastapi import Depends, HTTPException, status, APIRouter, Depends
from app.api.services.user_manager import UserManager
from fastapi.security import OAuth2PasswordRequestForm
from app.api.schemas.auth import Token
from app.core.security import create_access_token


auth_router = APIRouter()


@auth_router.post("/signup", response_model=UserOut)
async def sign_up(
    user_in: UserIn, user_manager: UserManager = Depends(get_user_manager)
) -> UserOut:
    """
    Register a new user account.

    Args:
        user_in (UserIn): Incoming user registration data includes fields
        such as email address, username and password.

        user_manager (UserManager): The user management instance responsible
        for handling the logic of user creation. Injected via dependency.
        Defaults to Depends(get_user_manager).

    Returns:
        dict (UserOut): User object formatted according to the response schema,
        includes username and email.
    """
    user = user_manager.sign_up_user(**dict(user_in))
    return user


# autorize in SwaggerUI doesn't work without this form
@auth_router.post("/auth")
async def sign_in_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    user_manager: UserManager = Depends(get_user_manager),
) -> Token:
    """
    Authenticate a user and return an access token.

    Args:
        form_data: OAuth2PasswordRequestForm.
        The form data containing the username(email) and password.
        Injected via dependency. Defaults to Depends().

        user_manager (UserManager): The user management instance responsible
        for handling authentication logic. Injected via dependency.
        Defaults to Depends(get_user_manager).

    Returns:
        Token: a Token object containing the access token type ("bearer").
    """
    user = user_manager.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email})
    return Token(access_token=access_token, token_type="bearer")
