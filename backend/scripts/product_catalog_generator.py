
import random
import json
import os
random.seed(42)

# -----------------------------
# Helper Functions
# -----------------------------

def weighted_choice(options, weights):
    return random.choices(options, weights=weights, k=1)[0]

def generate_rating():
    return round(min(4.9, max(3.8, random.gauss(4.4, 0.2))), 1)

def generate_inventory():
    return max(5, int(random.gauss(80, 25)))

def generate_discount():
    return weighted_choice(
        [0, 10, 15, 20, 25, 30, 40],
        [5, 20, 25, 25, 15, 8, 2]
    )

def generate_price(price_range):
    start, end = price_range
    prices = list(range(((start + 99)//100)*100 - 1, end + 100, 100))
    prices = [p if p >= start else start for p in prices]
    weights = list(range(len(prices), 0, -1))
    return weighted_choice(prices, weights)

# -----------------------------
# Sellers & Regions
# -----------------------------

SELLERS = [f"S{i:03}" for i in range(1, 16)]

REGIONS = ["Lucknow","Jaipur","Indore","Patna","Nagpur","Coimbatore"]

# -----------------------------
# Category Configuration
# -----------------------------

CATEGORY_CONFIG = {

    "Kurta": {
        "count": 40,
        "brands": ["Libas","Biba","W","Anouk","Sangria"],
        "brand_weights":[35,20,15,15,15],
        "colors":["Purple","Blue","Pink","White","Green","Yellow","Dark Blue","Grey","Navy","Light Blue"],
        "color_weights":[12,18,15,10,10,8,8,7,6,6],
        "occasions":["Office","Casual","Festive"],
        "occasion_weights":[40,40,20],
        "materials":{
            "Office":{"materials":["Cotton","Rayon"],"weights":[75,25]},
            "Casual":{"materials":["Cotton","Rayon","Linen"],"weights":[50,35,15]},
            "Festive":{"materials":["Silk","Rayon"],"weights":[70,30]}
        },
        "seasons":["Summer","Spring","All Season"],
        "season_weights":[60,25,15],
        "gender":"Women",
        "price":(699,2499)
    },

    "Saree": {
        "count":35,
        "brands":["Anouk","Mitera","Kalini","Sangria"],
        "brand_weights":[30,25,25,20],
        "colors":["Red","Blue","Green","Pink","Black","Maroon"],
        "color_weights":[25,20,20,15,10,10],
        "occasions":["Wedding","Party","Festive"],
        "occasion_weights":[40,30,30],
        "materials":{
            "Wedding":{"materials":["Silk","Georgette"],"weights":[80,20]},
            "Party":{"materials":["Georgette","Chiffon","Silk"],"weights":[45,35,20]},
            "Festive":{"materials":["Silk","Cotton"],"weights":[70,30]}
        },
        "seasons":["All Season","Festive"],
        "season_weights":[80,20],
        "gender":"Women",
        "price":(999,4999)
    },

    "Shirt":{
        "count":30,
        "brands":["Roadster","Louis Philippe","Allen Solly","Highlander"],
        "brand_weights":[30,25,25,20],
        "colors":["White","Blue","Black","Grey","Olive"],
        "color_weights":[25,25,20,15,15],
        "occasions":["Office","Casual"],
        "occasion_weights":[60,40],
        "materials":{
            "Office":{"materials":["Cotton","Linen"],"weights":[75,25]},
            "Casual":{"materials":["Cotton","Linen"],"weights":[60,40]}
        },
        "seasons":["Summer","All Season"],
        "season_weights":[60,40],
        "gender":"Men",
        "price":(799,2999)
    },

    "Sneakers":{
        "count":30,
        "brands":["Nike","Adidas","Puma","HRX"],
        "brand_weights":[30,25,25,20],
        "colors":["White","Black","Grey","Blue"],
        "color_weights":[40,35,15,10],
        "occasions":["Sports","Casual"],
        "occasion_weights":[70,30],
        "materials":{
            "Sports":{"materials":["Mesh","Synthetic"],"weights":[80,20]},
            "Casual":{"materials":["Canvas","Mesh","Synthetic"],"weights":[45,35,20]}
        },
        "seasons":["All Season"],
        "season_weights":[100],
        "gender":"Unisex",
        "price":(1499,5999)
    },

    "Jeans":{
        "count":12,
        "brands":["Levis","Wrangler","Roadster","Pepe Jeans"],
        "brand_weights":[35,20,25,20],
        "colors":["Blue","Black","Grey"],
        "color_weights":[60,25,15],
        "occasions":["Casual"],
        "occasion_weights":[100],
        "materials":{
            "Casual":{"materials":["Denim"],"weights":[100]}
        },
        "seasons":["All Season"],
        "season_weights":[100],
        "gender":"Unisex",
        "price":(999,3499)
    }
}

# -----------------------------
# Generator
# -----------------------------

PRODUCT_CATALOG = []
product_no = 1

for category, cfg in CATEGORY_CONFIG.items():

    titles = set()

    max_attempts = cfg["count"] * 20
    attempts = 0

    while len(titles) < cfg["count"] and attempts < max_attempts:
        attempts += 1

        brand = weighted_choice(cfg["brands"], cfg["brand_weights"])
        color = weighted_choice(cfg["colors"], cfg["color_weights"])
        occasion = weighted_choice(cfg["occasions"], cfg["occasion_weights"])

        material_rule = cfg["materials"][occasion]
        material = weighted_choice(
            material_rule["materials"],
            material_rule["weights"]
        )

        season = weighted_choice(
            cfg["seasons"],
            cfg["season_weights"]
        )

        title = f"{brand} {color} {material} {category}"

        if title in titles:
            continue

        titles.add(title)

        PRODUCT_CATALOG.append({
            "product_id": f"P{product_no:04}",
            "seller_id": random.choice(SELLERS),
            "title": title,
            "brand": brand,
            "category": category,
            "price": generate_price(cfg["price"]),
            "color": color,
            "material": material,
            "occasion": occasion,
            "gender": cfg["gender"],
            "season": season,
            "inventory": generate_inventory(),
            "rating": generate_rating(),
            "discount": generate_discount(),
            "available_regions": sorted(
                random.sample(REGIONS, random.randint(3,6))
            )
        })

        product_no += 1
    if len(titles) < cfg["count"]:
       print(
        f"Warning: Only generated "
        f"{len(titles)} unique {category} products."
       )
print(f"Generated {len(PRODUCT_CATALOG)} products.")

os.makedirs("data", exist_ok=True)
with open("data/products.json", "w", encoding="utf-8") as f:
    json.dump(PRODUCT_CATALOG, f, indent=4)

