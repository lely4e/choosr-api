from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError, HTTPException
from starlette.status import HTTP_422_UNPROCESSABLE_ENTITY
from sqlalchemy.exc import DataError


# Pydantic validation errors (422)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "Validation failed",
            "details": exc.errors(),
        },
    )


# HTTPExceptions
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail or "An HTTP error occurred"},
    )


# Global exception handler
async def exception_handler(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"error": str(exc)})


# Data Error Handler
async def data_error_handler(request, exc: DataError):
    return JSONResponse(status_code=400, content={"error": "Invalid poll token format"})


class UserNotFoundError(Exception):
    """Custom exception if user not found."""

    def __init__(self, message="User not found"):
        self.message = message
        super().__init__(self.message)


async def user_not_found_handler(request: Request, exc: UserNotFoundError):
    return JSONResponse(status_code=404, content={"error": exc.message})


class PollNotFoundError(Exception):
    """Custom exception if poll not found."""

    def __init__(self, message="Poll not found"):
        self.message = message
        super().__init__(self.message)


async def poll_not_found_handler(request: Request, exc: UserNotFoundError):
    return JSONResponse(status_code=404, content={"error": exc.message})


class UserAlreadyExistsError(Exception):
    """Custom exception if user already exists."""

    def __init__(self, message="User already exists"):
        self.message = message
        super().__init__(self.message)


async def user_exists_handler(request: Request, exc: UserAlreadyExistsError):
    return JSONResponse(status_code=400, content={"error": exc.message})
