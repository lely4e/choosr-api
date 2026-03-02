import uvicorn
from fastapi import FastAPI, Request, HTTPException, status
from app.api import router
from fastapi.responses import JSONResponse
import jwt
from jwt import InvalidTokenError
from app.core.config import settings
from fastapi.exceptions import RequestValidationError, HTTPException
from app.core.security import SECRET_KEY, ALGORITHM
from app.core.errors import (
    validation_exception_handler,
    http_exception_handler,
    exception_handler,
)
from app.core.errors import UserNotFoundError, user_not_found_handler
from app.core.errors import PollNotFoundError, poll_not_found_handler
from app.core.errors import ProductNotFoundError, product_not_found_handler
from app.core.errors import VoteNotFoundError, vote_not_found_handler
from app.core.errors import CommentsNotFoundError, comments_not_found_handler
from app.core.errors import UserAlreadyExistsError, user_exists_handler
from app.core.errors import DataError, data_error_handler
from app.core.errors import IntegrityError, integrity_error_handler
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="0.1.0",
)


app.include_router(router)

app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(UserNotFoundError, user_not_found_handler)
app.add_exception_handler(Exception, exception_handler)
app.add_exception_handler(PollNotFoundError, poll_not_found_handler)
app.add_exception_handler(UserAlreadyExistsError, user_exists_handler)
app.add_exception_handler(DataError, data_error_handler)
app.add_exception_handler(ProductNotFoundError, product_not_found_handler)
app.add_exception_handler(VoteNotFoundError, vote_not_found_handler)
app.add_exception_handler(CommentsNotFoundError, comments_not_found_handler)
app.add_exception_handler(IntegrityError, integrity_error_handler)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    if request.method == "OPTIONS":
        return await call_next(request)

    if (
        request.url.path.startswith("/docs")
        or request.url.path.startswith("/openapi")
        or request.url.path.startswith("/auth")
        or request.url.path.startswith("/login")
        or request.url.path.startswith("/signup")
    ):
        return await call_next(request)

    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"detail": "Missing token"},
        )

    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        request.state.user = payload.get("sub")
    except InvalidTokenError:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"detail": "Invalid token"},
        )

    response = await call_next(request)
    return response


# Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    uvicorn.run(app="main:app", reload=True)
