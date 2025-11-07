from app.db.database import engine, Base
from app.db.models import *


def init_db():
    Base.metadata.create_all(bind=engine)


def main():
    init_db()


if __name__ == "__main__":
    main()
