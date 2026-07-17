import json
import os

from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))

db = client["shelfiq"]

products_collection = db["products"]
events_collection = db["events"]

with open("data/products.json", "r", encoding="utf-8") as f:
    products = json.load(f)

with open("data/synthetic_events.json", "r", encoding="utf-8") as f:
    events = json.load(f)

products_collection.delete_many({})
events_collection.delete_many({})

products_collection.insert_many(products)
events_collection.insert_many(events)

print("Products:", products_collection.count_documents({}))
print("Events:", events_collection.count_documents({}))