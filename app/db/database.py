from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.core.config import settings

# sync driver
DATABASE_URL = settings.SYNC_DATABASE_URL

engine = create_engine(DATABASE_URL, echo=False, future=True)


class Base(DeclarativeBase):
    pass


# Sessionmaker for dependency injection
sync_session_maker = sessionmaker(bind=engine, autocommit=False, autoflush=False)


# Dependency to get DB session (e.g., in FastAPI)
def get_db():
    db = sync_session_maker()
    try:
        yield db
    finally:
        db.close()
