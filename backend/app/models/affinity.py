from pydantic import BaseModel


class Preference(BaseModel):
    name: str
    score: int


class AffinityResponse(BaseModel):
    user_id: str

    favorite_categories: list[Preference]
    favorite_brands: list[Preference]
    favorite_colors: list[Preference]