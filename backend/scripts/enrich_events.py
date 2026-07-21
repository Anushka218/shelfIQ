import json
import os
import time
os.makedirs("data", exist_ok=True)

from groq import RateLimitError

from app.ai.query_parser import parse_search_query

INPUT_FILE = "data/synthetic_events.json"
OUTPUT_FILE = "data/synthetic_events_enriched.json"
CACHE_FILE = "data/parsed_queries.json"


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)


# ----------------------------------------------------
# Load Events
# ----------------------------------------------------
events = load_json(INPUT_FILE)

# ----------------------------------------------------
# Load Cache
# ----------------------------------------------------
if os.path.exists(CACHE_FILE):
    parsed_cache = load_json(CACHE_FILE)
else:
    parsed_cache = {}

# ----------------------------------------------------
# Find Unique Queries
# ----------------------------------------------------
unique_queries = sorted(
    {event["search_query"] for event in events}
)

print(f"Total Events      : {len(events)}")
print(f"Unique Queries    : {len(unique_queries)}")
print(f"Already Parsed    : {len(parsed_cache)}")

remaining_queries = [
    query
    for query in unique_queries
    if query not in parsed_cache
]

print(f"Remaining Queries : {len(remaining_queries)}\n")

# ----------------------------------------------------
# Parse Remaining Queries
# ----------------------------------------------------
for idx, query in enumerate(remaining_queries, start=1):

    while True:
        try:
            print(
                f"[{idx}/{len(remaining_queries)}] Parsing: {query}"
            )

            parsed = parse_search_query(query)

            parsed_cache[query] = parsed.model_dump()

            save_json(CACHE_FILE, parsed_cache)

            break

        except RateLimitError:
            print("\nRate limit reached.")
            print("Sleeping for 60 seconds...\n")
            time.sleep(60)

        except Exception as e:
            print(f"\nError while parsing:")
            print(query)
            print(e)
            print("Skipping...\n")
            break

# ----------------------------------------------------
# Attach Parsed Queries
# ----------------------------------------------------
for event in events:
    event["parsed_query"] = parsed_cache.get(
        event["search_query"],
        None
    )

# ----------------------------------------------------
# Save Enriched Events
# ----------------------------------------------------
save_json(OUTPUT_FILE, events)

print("\n======================================")
print("Query enrichment completed successfully.")
print(f"Enriched events saved to: {OUTPUT_FILE}")
print(f"Query cache saved to: {CACHE_FILE}")
print("======================================")