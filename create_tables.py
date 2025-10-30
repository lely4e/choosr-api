from app.db.database import engine, Base


def init_db():
    Base.metadata.create_all(bind=engine)


def main():
    init_db()


if __name__ == "__main__":
    main()
