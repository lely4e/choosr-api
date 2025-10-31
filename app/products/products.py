import requests

# url = "https://fakestoreapi.com/products/1"


def get_info(link):
    url = requests.get(link)
    return (url.json()["title"], url.json()["description"], url.json()["price"])
