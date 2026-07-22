import random
from app.database import prospective_sellers_collection


# Clear existing data
prospective_sellers_collection.delete_many({})

regions = [
    "Lucknow",
    "Jaipur",
    "Delhi",
    "Mumbai",
    "Bengaluru",
    "Hyderabad",
    "Pune",
    "Ahmedabad",
    "Kolkata",
    "Chennai",
    "Kanpur",
    "Indore",
]

categories = [
    "Kurta",
    "Shirt",
    "Jeans",
    "Sneakers",
    "Saree",
]

specialties = [
    "Cotton",
    "Linen",
    "Denim",
    "Canvas",
    "Silk",
    "Handloom",
    "Printed",
    "Casual",
    "Formal",
    "Festive",
]

business_prefixes = [
    "Royal",
    "Urban",
    "Classic",
    "Heritage",
    "Elite",
    "Modern",
    "Premium",
    "Style",
    "Fashion",
    "Elegant",
    "Shree",
    "New",
]

business_suffixes = [
    "Garments",
    "Textiles",
    "Fashions",
    "Apparels",
    "Collections",
    "Boutique",
    "Traders",
    "House",
    "Store",
    "Lifestyle",
]


def generate_phone():
    return "+91" + "".join(random.choices("0123456789", k=10))


for i in range(1, 41):

    primary_region = random.choice(regions)

    seller_categories = random.sample(categories, random.randint(1, 2))

    seller_specialties = random.sample(
        specialties,
        random.randint(1, 2),
    )

    serviceable_regions = list(
        set(
            [primary_region]
            + random.sample(
                regions,
                random.randint(1, 3),
            )
        )
    )

    business_name = (
        random.choice(business_prefixes)
        + " "
        + random.choice(seller_categories)
        + " "
        + random.choice(business_suffixes)
    )

    document = {
        "seller_id": f"PS{i:03}",
        "business_name": business_name,
        "primary_region": primary_region,
        "serviceable_regions": serviceable_regions,
        "categories": seller_categories,
        "specialties": seller_specialties,
        "rating": round(random.uniform(3.8, 5.0), 1),
        "estimated_inventory": random.randint(150, 1000),
        "verified": random.random() < 0.8,
        "marketplace_joined": False,
        "contact_email": f"seller{i}@example.com",
        "contact_phone": generate_phone(),
    }

    prospective_sellers_collection.insert_one(document)

print("Generated 40 prospective sellers.")