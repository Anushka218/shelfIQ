from collections import defaultdict

from app.database import products_collection, events_collection

from statistics import median


def normalize(value: str | None):
    if not value:
        return None

    return value.strip().lower()


def detect_catalog_gap(region: str):
    """
    Detect categories with high search demand but low product availability
    in a given region.
    """

    MIN_SEARCHES = 10
    CATALOG_GAP_RATIO = 5

    # ----------------------------
    # Step 1: Count demand
    # ----------------------------
    demand = defaultdict(int)

    cursor = events_collection.find(
        {"region": region},
        {
            "parsed_query.category": 1,
            "_id": 0,
        },
    )

    for event in cursor:
        category = normalize(
            event.get("parsed_query", {}).get("category")
        )

        if category:
            demand[category] += 1

    # ----------------------------
    # Step 2: Count supply
    # ----------------------------
    supply = defaultdict(int)

    cursor = products_collection.find(
        {"available_regions": region},
        {
            "category": 1,
            "_id": 0,
        },
    )

    for product in cursor:
        category = normalize(product.get("category"))

        if category:
            supply[category] += 1

    # ----------------------------
    # Step 3: Compare demand & supply
    # ----------------------------
    gaps = []

    for category, search_count in demand.items():

        if search_count < MIN_SEARCHES:
            continue

        product_count = supply.get(category, 0)

        demand_supply_ratio = (
            search_count / max(product_count, 1)
        )

        if demand_supply_ratio >= CATALOG_GAP_RATIO:

            demand_score = search_count * demand_supply_ratio

            gaps.append(
                {
                    "category": category,
                    "gap_type": "catalog_gap",
                    "demand_score": round(demand_score, 2),
                    "searches": search_count,
                    "available_products": product_count,
                    "ratio": round(demand_supply_ratio, 2),
                    "evidence": (
                        f"{search_count} searches in {region} "
                        f"against only {product_count} available products "
                        f"(Demand/Supply Ratio: {demand_supply_ratio:.2f})."
                    ),
                }
            )

    gaps.sort(
        key=lambda x: x["demand_score"],
        reverse=True,
    )

    return gaps


def detect_price_gap(region: str):
    """
    Analyze pricing opportunities by comparing customer budgets with
    product prices available in a region.
    """

    MIN_SEARCHES = 10

    # ----------------------------
    # Step 1: Collect customer budgets
    # ----------------------------
    budgets = defaultdict(list)

    cursor = events_collection.find(
        {"region": region},
        {
            "parsed_query.category": 1,
            "parsed_query.price_limit": 1,
            "_id": 0,
        },
    )

    for event in cursor:

        parsed = event.get("parsed_query", {})

        category = normalize(parsed.get("category"))
        price_limit = parsed.get("price_limit")

        if category and isinstance(price_limit, (int, float)):
            budgets[category].append(price_limit)

    # ----------------------------
    # Step 2: Collect product prices
    # ----------------------------
    product_prices = defaultdict(list)

    cursor = products_collection.find(
        {"available_regions": region},
        {
            "category": 1,
            "price": 1,
            "_id": 0,
        },
    )

    for product in cursor:

        category = normalize(product.get("category"))

        if category:
            product_prices[category].append(product["price"])

    # ----------------------------
    # Step 3: Price Opportunity Analysis
    # ----------------------------
    opportunities = []

    for category, customer_budgets in budgets.items():

        if len(customer_budgets) < MIN_SEARCHES:
            continue

        prices = product_prices.get(category)

        if not prices:
            continue

        median_budget = median(customer_budgets)

        affordable_products = sum(
            1
            for price in prices
            if price <= median_budget
        )

        total_products = len(prices)

        budget_match_rate = affordable_products / total_products

        if budget_match_rate == 1:
            continue

        affected_searches = len(customer_budgets)

        opportunity_score = (
            affected_searches
            * (1 - budget_match_rate)
        )

        opportunities.append(
            {
                "category": category,
                "gap_type": "price_opportunity",
                "median_budget": round(median_budget),
                "total_products": total_products,
                "affordable_products": affordable_products,
                "budget_match_rate": round(
                    budget_match_rate * 100,
                    1,
                ),
                "affected_searches": affected_searches,
                "opportunity_score": round(
                    opportunity_score,
                    2,
                ),
                "evidence": (
                    f"{(1 - budget_match_rate) * 100:.1f}% of products "
                    f"are priced above the typical customer budget "
                    f"of ₹{round(median_budget)} in {region}."
                ),
            }
        )

    opportunities.sort(
        key=lambda x: x["opportunity_score"],
        reverse=True,
    )

    return opportunities


def detect_brand_opportunity(region: str):
    """
    Detect brands with high customer demand but limited availability
    in a given region.
    """

    MIN_SEARCHES = 10
    BRAND_GAP_RATIO = 5

    # ----------------------------
    # Step 1: Count demand
    # ----------------------------
    demand = defaultdict(int)

    cursor = events_collection.find(
        {"region": region},
        {
            "parsed_query.brand": 1,
            "_id": 0,
        },
    )

    for event in cursor:

        brand = normalize(
            event.get("parsed_query", {}).get("brand")
        )

        if brand:
            demand[brand] += 1

    # ----------------------------
    # Step 2: Count supply
    # ----------------------------
    supply = defaultdict(int)

    cursor = products_collection.find(
        {"available_regions": region},
        {
            "brand": 1,
            "_id": 0,
        },
    )

    for product in cursor:

        brand = normalize(product.get("brand"))

        if brand:
            supply[brand] += 1

    # ----------------------------
    # Step 3: Compare demand & supply
    # ----------------------------
    opportunities = []

    for brand, search_count in demand.items():

        if search_count < MIN_SEARCHES:
            continue

        product_count = supply.get(brand, 0)

        demand_supply_ratio = (
            search_count / max(product_count, 1)
        )

        if demand_supply_ratio < BRAND_GAP_RATIO:
            continue

        opportunity_score = (
            search_count * demand_supply_ratio
        )

        opportunities.append(
            {
                "brand": brand,
                "gap_type": "brand_opportunity",
                "searches": search_count,
                "available_products": product_count,
                "ratio": round(demand_supply_ratio, 2),
                "opportunity_score": round(
                    opportunity_score,
                    2,
                ),
                "evidence": (
                    f"{search_count} searches for {brand.title()} "
                    f"against only {product_count} available products "
                    f"in {region}."
                ),
            }
        )

    opportunities.sort(
        key=lambda x: x["opportunity_score"],
        reverse=True,
    )

    return opportunities


def detect_attribute_opportunity(region: str, attribute: str):
    """
    Detect high-demand category + attribute combinations
    (e.g. Black Sneakers, Cotton Kurta, Festive Saree).
    """

    MIN_SEARCHES = 10
    ATTRIBUTE_GAP_RATIO = 5

    # ----------------------------
    # Step 1: Demand
    # ----------------------------
    demand = defaultdict(int)

    cursor = events_collection.find(
        {"region": region},
        {
            "parsed_query.category": 1,
            f"parsed_query.{attribute}": 1,
            "_id": 0,
        },
    )

    for event in cursor:

        parsed = event.get("parsed_query", {})

        category = normalize(parsed.get("category"))
        value = normalize(parsed.get(attribute))

        if category and value:
            demand[(category, value)] += 1

    # ----------------------------
    # Step 2: Supply
    # ----------------------------
    supply = defaultdict(int)

    cursor = products_collection.find(
        {"available_regions": region},
        {
            "category": 1,
            attribute: 1,
            "_id": 0,
        },
    )

    for product in cursor:

        category = normalize(product.get("category"))
        value = normalize(product.get(attribute))

        if category and value:
            supply[(category, value)] += 1

    # ----------------------------
    # Step 3: Compare
    # ----------------------------
    opportunities = []

    for (category, value), searches in demand.items():

        if searches < MIN_SEARCHES:
            continue

        products = supply.get((category, value), 0)

        ratio = searches / max(products, 1)

        if ratio < ATTRIBUTE_GAP_RATIO:
            continue

        opportunity_score = searches * ratio

        opportunities.append(
            {
                "category": category,
                "attribute": attribute,
                "value": value,
                "gap_type": "attribute_opportunity",
                "searches": searches,
                "available_products": products,
                "ratio": round(ratio, 2),
                "opportunity_score": round(opportunity_score, 2),
                "evidence": (
                    f"{searches} searches for "
                    f"{value.title()} {category.title()} "
                    f"against only {products} matching products "
                    f"in {region}."
                ),
            }
        )

    opportunities.sort(
        key=lambda x: x["opportunity_score"],
        reverse=True,
    )

    return opportunities