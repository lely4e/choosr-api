# 🎈 Choosr API - FastAPI Backend for Polling and Voting
A FastAPI backend for creating collaborative polls and event-based voting. Users can share event links, add products, and vote on their favorites, making group decision-making simple and interactive. Features JWT authentication, PostgreSQL with SQLAlchemy ORM, clean architecture, and full CRUD support—perfect for event planning, group shopping, and collaborative voting apps.

# 🔐 Authentication & Access Control
The app uses JWT (JSON Web Token) authentication to secure all endpoints. Only registered users can access the application, create polls, add items, or vote.
* Users must register and log in to receive a JWT token.
* The token must be included in the Authorization header for every request:
```
Authorization: Bearer <your_token_here>
```
* Access to endpoints is controlled via FastAPI middleware and dependency injection, ensuring that unauthenticated users cannot interact with the app.

This guarantees that all polls, votes, and product additions are protected and tied to registered accounts, making the app secure and reliable for collaborative decision-making.


# ⭐️ Features
* User authentication using JWT tokens
* Create, read, update, and delete polls
* Share polls with participants via unique links
* Add products to polls and vote on favorites
* Collaborative, interactive group decision-making
* PostgreSQL database with SQLAlchemy ORM
* Structured with clean architecture and modular FastAPI routers

# ⚙️ Requirements
* Python 3.11+
* PostgreSQL 12+
* [Poetry or pip] for dependency management (optional)
* Install the dependencies with pip:
```
pip install -r requirements.txt
```
* Create an .env file in the project root:
```
SECRET_KEY=SECRET_KEY
DB_HOST=DB_HOST
DB_PORT=DB_PORT
DB_USER=DB_USER
DB_PASS=DB_PASS
DB_NAME=DB_NAME
```
⚠️ Never commit your .env file to GitHub.

# 🌳 Project Structure
```
choosr_API_project/
│
├── app/
│   ├── __init__.py
│   │            
│   ├── api/                  # routers (endpoints)
│   │   ├── __init__.py       # all routers
│   │   ├── routes/           # routes 
│   │   ├── services/         # CRUD
│   │   ├── dependencies.py   # dependencies
│   │   └── schemas.py        # pydantic schema
│   │ 
│   ├── core/                 # core logic & configuration
│   │   ├── __init__.py
│   │   ├── config.py         # pydantic settings
│   │   ├── errors.py         # custom errors
│   │   └── security.py       # authentification
│   │ 
│   ├── db/                   # database-related files
│   │   ├── __init__.py
│   │   ├── database.py       # Base = declarative_base()
│   │   └── models.py         # DB models
│   │ 
│   └── utils/                # products API
│
├── .env                      # environment variables (not in git)
├── .gitignore                # gitignore
├── create_tables.py          # creating tables
├── main.py                   # main func
├── README.md                 # project documentation
└── requirements.txt          # requirements
```
