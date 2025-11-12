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
* ⚡ FastAPI framework with async endpoints
* 🔐 User authentication using JWT tokens
* 🗳️ Full CRUD functionality 
* 🔗 Share polls with participants via unique links
* 🔍 Searching products via Search API
* ➕ Add products to polls and vote on favorites
* 🧩 Collaborative, interactive group decision-making
* 🐘 PostgreSQL database with SQLAlchemy ORM
* ⚙️ Structured with clean architecture and modular FastAPI routers
* 🐳 Dockerized setup for easy production deployment
* ☁️ Deployed on Render (FastAPI app + PostgreSQL database)

## ☁️ Deployment
The project is deployed and running on Render.com using:
* Dockerized FastAPI app
* Render PostgreSQL database
* Continuous deployment from GitHub
Render handles automatic builds and deployments on each push to the main branch.

## ⚙️ Requirements
* Python 3.11+
* PostgreSQL 12+
* Docker 
* Install the dependencies with pip:
```
pip install -r requirements.txt
```

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
├── .dockerignore  
├── .env                      
├── .gitignore               
├── create_tables.py  
├── Dockerfile    
├── main.py       
├── README.md                 
└── requirements.txt 
```

## 🔖 Notes
* 🔑 Keep sensitive data in .env (never commit it).
* 🚫 Use .gitignore and 🐋 .dockerignore to avoid uploading unnecessary or secret files.
* 🚀 You can run the app via uvicorn app.main:app --reload locally or use Docker for production.

## 📌 Dependencies

```
fastapi==0.118.0
uvicorn==0.37.0
SQLAlchemy==2.0.44
psycopg2==2.9.11
python-dotenv==1.1.1
pydantic-settings==2.11.0
pydantic==2.11.10
python-multipart==0.0.20
email-validator==2.3.0
bcrypt==5.0.0
argon2-cffi==25.1.0
requests==2.32.5
PyJWT==2.10.1
```

* JWT / Authentication: PyJWT and bcrypt handle token encoding/decoding and password hashing
* FastAPI / ASGI server: fastapi + uvicorn for high-performance async API serving
* Database: SQLAlchemy + psycopg2 (PostgreSQL driver)
* Environment variables: python-dotenv for managing environment configs
* Email validation: email-validator for user registration forms
