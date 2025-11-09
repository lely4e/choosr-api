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
│   │   └── schemas.py        # Pydantic schema
│   │ 
│   ├── core/                 # core logic & configuration
│   │   ├── __init__.py
│   │   ├── config.py         # Pydantic Settings
│   │   ├── errors.py         # Custom Errors
│   │   └── security.py       # Authentification
│   │ 
│   ├── db/                   # database-related files
│   │   ├── __init__.py
│   │   ├── database.py       # Base = declarative_base(), create_engine(), SessionLocal
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

