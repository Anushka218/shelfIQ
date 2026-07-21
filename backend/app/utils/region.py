from fastapi import HTTPException

# Canonical region names used throughout the application
VALID_REGIONS = {
    "lucknow": "Lucknow",
    "jaipur": "Jaipur",
    "indore": "Indore",
    "patna": "Patna",
    "nagpur": "Nagpur",
    "coimbatore": "Coimbatore",
}


def normalize_region(region: str) -> str:
    """
    Normalize a region name so the API becomes case-insensitive.

    Examples:
        lucknow   -> Lucknow
        LUCKNOW   -> Lucknow
        LuCkNoW   -> Lucknow
    """

    key = region.strip().lower()

    if key not in VALID_REGIONS:
        raise HTTPException(
            status_code=404,
            detail=f"Region '{region}' not found"
        )

    return VALID_REGIONS[key]