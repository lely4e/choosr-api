import requests
from pathlib import Path

# import httpx
# from app.core.config import settings
import json


# def get_items_test(text):
#     # url = f"https://www.searchapi.io/api/v1/searches/{text}"  # search_W75dANvqloTdM7QBZ4blrDJ3
#     url = f"https://www.searchapi.io/api/v1/searches/search_W75dANvqloTdM7QBZ4blrDJ3"

#     response = requests.get(url)
#     data = response.json()
#     items = []
#     for item in data.get("organic_results", []):
#         items.append(
#             {
#                 "title": item.get("title"),
#                 "link": item.get("link"),
#                 "image": item.get("thumbnail"),
#                 "rating": item.get("rating"),
#                 "price": item.get("extracted_price"),
#             }
#         )

#     return items


# -------------------------- JSON ---------------------


def get_items_test_json(text):
    file_path = Path(__file__).parent / "products.json"

    with open(file_path, "r") as file:
        data = json.load(file)

    return data


# get_items_test_json("text")
# -----------------Amazon Search API-----------------


# def get_items_from_API(text):
#     url = "https://www.searchapi.io/api/v1/search"
#     params = {
#         "engine": "amazon_search",
#         "q": text,
#         "api_key": settings.API_KEY,
#     }

#     response = requests.get(url, params=params, timeout=10)

#     if response.status_code != 200:
#         return []
#         # return {"error": "Search API failed", "details": response.text}

#     # async with httpx.AsyncClient() as client:
#     #     response = await client.get(url, params=params)

#     data = response.json()
#     items = []
#     for item in data.get("organic_results", []):
#         items.append(
#             {
#                 "title": item.get("title"),
#                 "link": item.get("link"),
#                 "image": item.get("thumbnail"),
#                 "rating": item.get("rating"),
#                 "price": item.get("extracted_price"),
#             }
#         )

#     return items
