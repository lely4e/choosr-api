## 🎈 Choosr API - FastAPI Backend for Polling and Voting
A FastAPI backend for creating collaborative polls and event-based voting. Users can share event links, add products using search Amazon API, and vote on their favorites, making group decision-making simple and interactive. Features JWT authentication, PostgreSQL with SQLAlchemy ORM, clean architecture, and full CRUD support—perfect for event planning, group shopping, and collaborative voting apps.

## 🔐 Authentication & Access Control
The app uses JWT (JSON Web Token) authentication to secure all endpoints. Only registered users can access the application, create polls, add items, or vote.
* Users must register and log in to receive a JWT token.
* The token must be included in the Authorization header for every request:
```
Authorization: Bearer <your_token_here>
```
* Access to endpoints is controlled via FastAPI middleware and dependency injection, ensuring that unauthenticated users cannot interact with the app.


## ⭐️ Features
* User authentication using JWT tokens
* Full CRUD functionality
* Share polls with participants via unique links
* Add products to polls and vote on favorites
* Collaborative, interactive group decision-making
* PostgreSQL database with SQLAlchemy ORM
* Structured with clean architecture and modular FastAPI routers

## ⚙️ Requirements
* Python 3.11+
* PostgreSQL 12+
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

## 🌳 Project Structure
```
choosr_API_project/
│                                   ├── __init__.py
├── app/                            ├── auth.py
│   ├── __init__.py                 ├── comments.py
│   │                               ├── poll.py
│   ├── api/                        ├── product.py
│   │   ├── __init__.py             ├── user.py
│   │   ├── routes/ ─────────────────── vote.py
│   │   ├── services/ ───────────────── __init__.py       
│   │   ├── dependencies.py         ├── comment_manager.py
│   │   └── schemas.py              ├── poll_manager.py
│   │                               ├── product_manager.py
│   ├── core/                       ├── user_manager.py
│   │   ├── __init__.py             ├── vote_manager.py 
│   │   ├── config.py             
│   │   ├── errors.py         
│   │   └── security.py       
│   │ 
│   ├── db/                   
│   │   ├── __init__.py
│   │   ├── database.py       
│   │   └── models.py         
│   │ 
│   └── utils/               
│
├── .env                      
├── .gitignore               
├── create_tables.py    
├── main.py       
├── README.md                 
└── requirements.txt 
```
## 📌 Dependencies

```
fastapi==0.118.0
uvicorn==0.37.0
SQLAlchemy==2.0.44
psycopg2==2.9.11
python-dotenv==1.1.1
python-jose==3.5.0
pydantic-settings==2.11.0
pydantic==2.11.10
python-multipart==0.0.20
email-validator==2.3.0
bcrypt==5.0.0
argon2-cffi==25.1.0
requests==2.32.5
```

* JWT / Authentication: python-jose and bcrypt cover password hashing and token encoding/decoding.
* FastAPI / ASGI server: fastapi + uvicorn
* Database: SQLAlchemy + psycopg2 (PostgreSQL driver)
* Environment variables: python-dotenv
* Email validation: email-validator
