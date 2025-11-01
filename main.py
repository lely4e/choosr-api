import uvicorn
from fastapi import FastAPI
from app.api import router
from fastapi import FastAPI, Request, HTTPException, status
from fastapi.responses import JSONResponse
from jose import JWTError, jwt
from fastapi.exceptions import RequestValidationError, HTTPException
from app.core.security import SECRET_KEY, ALGORITHM
from app.core.errors import (
    validation_exception_handler,
    http_exception_handler,
    exception_handler,
)
from app.core.errors import (
    UserNotFoundError,
    user_not_found_handler,
)
from app.core.errors import (
    PollNotFoundError,
    poll_not_found_handler,
)
from app.core.errors import (
    ProductNotFoundError,
    product_not_found_handler,
)
from app.core.errors import (
    UserAlreadyExistsError,
    user_exists_handler,
)
from app.core.errors import (
    DataError,
    data_error_handler,
)

app = FastAPI()


app.include_router(router)

app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(UserNotFoundError, user_not_found_handler)
app.add_exception_handler(Exception, exception_handler)
app.add_exception_handler(PollNotFoundError, poll_not_found_handler)
app.add_exception_handler(UserAlreadyExistsError, user_exists_handler)
app.add_exception_handler(DataError, data_error_handler)
app.add_exception_handler(ProductNotFoundError, product_not_found_handler)


if __name__ == "__main__":
    uvicorn.run(app="main:app", reload=True)
