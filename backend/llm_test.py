from app.ai.query_parser import parse_search_query

queries = [
    "nike blue sneakers under 3000"
]

for q in queries:
    print(q)
    print(parse_search_query(q))
