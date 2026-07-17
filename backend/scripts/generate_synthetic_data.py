
import json
import random
import os
from datetime import datetime, timedelta
BASE_DATE = datetime(2026, 7, 16, 12, 0, 0)

random.seed(42)

with open("data/products.json","r",encoding="utf-8") as f:
    PRODUCT_CATALOG=json.load(f)

def weighted_choice(options,weights):
    return random.choices(options,weights=weights,k=1)[0]

def get_price_bucket(price):
    buckets=[500,700,1000,1200,1500,2000,2500,3000,5000,7000]
    valid=[b for b in buckets if b>=price]
    return random.choice(valid[:3]) if valid else buckets[-1]

REGIONS=["Lucknow","Jaipur","Indore","Patna","Nagpur","Coimbatore"]



USER_PERSONAS={
"Budget Shopper":{"weight":30,"preferred_templates":["category_under_price","color_category_under_price","material_category_under_price"]},
"Brand Loyal":{"weight":20,"preferred_templates":["brand_category","brand_color_category"]},
"Trend Shopper":{"weight":20,"preferred_templates":["color_category","occasion_category","color_material_category"]},
"Minimal Searcher":{"weight":15,"preferred_templates":["category","color_category"]},
"Detailed Searcher":{"weight":15,"preferred_templates":["brand_color_material_category","occasion_material_category","gender_material_category"]}
}

PERSONA_NAMES = list(USER_PERSONAS.keys())
PERSONA_WEIGHTS = [v["weight"] for v in USER_PERSONAS.values()]

DEMO_USERS=[]
for region in REGIONS:
    DEMO_USERS.append({"user_id":f"demo_user_budget_{region.lower()}","region":region,"type":"budget","persona": "Budget Shopper" })
    DEMO_USERS.append({"user_id":f"demo_user_premium_{region.lower()}","region":region,"type":"premium","persona": "Brand Loyal"})

GENERAL_USERS = []

for i in range(1, 201):
    GENERAL_USERS.append({
        "user_id": f"user_{i:03}",
        "region": random.choice(REGIONS),
        "type": "general",
        "persona": weighted_choice(
            PERSONA_NAMES,
            PERSONA_WEIGHTS
        )
    })
ALL_USERS=DEMO_USERS+GENERAL_USERS

SEARCH_TEMPLATES={
"category":"{category}",
"color_category":"{color} {category}",
"material_category":"{material} {category}",
"brand_category":"{brand} {category}",
"occasion_category":"{occasion} {category}",
"brand_color_category":"{brand} {color} {category}",
"color_material_category":"{color} {material} {category}",
"brand_color_material_category":"{brand} {color} {material} {category}",
"occasion_material_category":"{occasion} {material} {category}",
"gender_material_category":"{gender} {material} {category}",
"category_under_price":"{category} under {price}",
"color_category_under_price":"{color} {category} under {price}",
"material_category_under_price":"{material} {category} under {price}"
}

def generate_search_query(product,persona):
    t=random.choice(USER_PERSONAS[persona]["preferred_templates"])
    return SEARCH_TEMPLATES[t].format(
        brand=product["brand"].lower(),
        color=product["color"].lower(),
        material=product["material"].lower(),
        category=product["category"].lower(),
        occasion=product["occasion"].lower(),
        gender=product["gender"].lower(),
        price=get_price_bucket(product["price"])
    )

def choose_product(user):
    available=[p for p in PRODUCT_CATALOG if user["region"] in p["available_regions"]]
    if not available:
        available=PRODUCT_CATALOG
    if user["type"]=="budget":
        filt=[p for p in available if p["price"]<=2000 or p["discount"]>=20]
        if filt: available=filt
    elif user["type"]=="premium":
        filt=[p for p in available if p["price"]>=2000 and p["rating"]>=4.4]
        if filt: available=filt
    return random.choice(available)

events=[]
for i in range(5000):
    user=random.choice(ALL_USERS)
    product=choose_product(user)

    click_prob = 0.55
    if product["rating"] >= 4.5:
       click_prob += 0.10
    if product["discount"] >= 20:
       click_prob += 0.10
    clicked = random.random() < click_prob

    wishlist_prob = 0.20
    if product["rating"] >= 4.4:
      wishlist_prob += 0.10
    wishlisted = (clicked and random.random() < wishlist_prob)

    purchase_prob = 0.30

    if product["discount"] >= 25:
      purchase_prob += 0.10
    purchased = ( wishlisted and random.random() < purchase_prob)

    ts=(BASE_DATE-timedelta(days=random.randint(0,29),hours=random.randint(0,23),minutes=random.randint(0,59))).isoformat(timespec="seconds")
    events.append({
        "event_id":f"E{i+1:06}",
        "user_id":user["user_id"],
        "region":user["region"],
        "timestamp":ts,
        "search_query":generate_search_query(product,user["persona"]),
        "product_id":product["product_id"],
        "clicked":clicked,
        "wishlisted":wishlisted,
        "purchased":purchased
    })
os.makedirs("data", exist_ok=True)
with open("data/synthetic_events.json","w",encoding="utf-8") as f:
    json.dump(events,f,indent=4)

print(f"Generated {len(events)} events.")
print(f"Saved to: data/synthetic_events.json")
