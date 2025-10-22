import uvicorn
from fastapi import FastAPI
from app.api import router

app = FastAPI()

app.include_router(router)

if __name__ == "__main__":
    uvicorn.run(app="main:app", reload=True)

# create tables
# from app.db.database import engine, Base


# def init_db():
#     Base.metadata.create_all(bind=engine)


# def main():
#     init_db()


# if __name__ == "__main__":
#     main()
