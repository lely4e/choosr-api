# Fake DB
USERS_DATA = [
    {
        "username": "admin",
        "password": "adminpass",
    }
]


def get_user(username: str):
    for user in USERS_DATA:
        if user.get("username") == username:
            return user
    return None


# Fake pole
POLL = [{"title": "Mike Birthday", "budget": 250}]

# Fake product
PRODUCT = [
    {
        "title": "Road Bike",
        "body": "Lightweight, designed for speed on paved roads.",
        "price": 210,
    }
]
