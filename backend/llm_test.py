from app.ai.query_parser import parse_search_query

queries = [
    "chikankari kurtis under 700 for raksha bandhan",
    "black shirts for office under 1200",
    "nike shoes",
    "cotton sarees for women",
    "party wear dress",
]

for q in queries:
    print(q)
    print(parse_search_query(q))
    print("-" * 50)