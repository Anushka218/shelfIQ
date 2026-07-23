import os
from pymongo import MongoClient
from dotenv import load_dotenv
from app.config import MONGO_URI, DATABASE_NAME

load_dotenv()
client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]
products_collection = db["products"]
events_collection = db["events"]
prospective_sellers_collection = db["prospective_sellers"]
users_collection = db["users"]