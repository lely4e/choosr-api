import uvicorn
from fastapi import FastAPI
from app.api.routes import app
from app.api import schemas


if __name__ == "__main__":
    uvicorn.run(app="main:app")
