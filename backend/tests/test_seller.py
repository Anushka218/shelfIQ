def test_seller_dashboard(client):
    response = client.get(
        "/seller/dashboard",
        params={"region": "Lucknow"},
    )

    assert response.status_code == 200

    data = response.json()

    assert data["region"] == "Lucknow"

    assert "catalog_gaps" in data
    assert "pricing_opportunities" in data
    assert "brand_opportunities" in data
    assert "attribute_opportunities" in data
    assert "seller_recommendations" in data
    assert "summary" in data


def test_seller_dashboard_summary(client):
    response = client.get(
        "/seller/dashboard",
        params={"region": "Lucknow"},
    )

    data = response.json()

    summary = data["summary"]

    assert "catalog_gap_count" in summary
    assert "pricing_opportunity_count" in summary
    assert "brand_opportunity_count" in summary
    assert "attribute_opportunity_count" in summary
    assert "seller_recommendation_count" in summary
    assert "top_catalog_gap" in summary
    assert "total_insights" in summary


def test_seller_recommendations(client):
    response = client.get(
        "/seller/dashboard",
        params={"region": "Lucknow"},
    )

    data = response.json()

    recommendations = data["seller_recommendations"]

    assert len(recommendations) > 0

    recommendation = recommendations[0]

    assert "category" in recommendation
    assert "catalog_gap" in recommendation
    assert "recommended_sellers" in recommendation


def test_recommended_seller_fields(client):
    response = client.get(
        "/seller/dashboard",
        params={"region": "Lucknow"},
    )

    data = response.json()

    seller = data["seller_recommendations"][0]["recommended_sellers"][0]

    assert "seller_id" in seller
    assert "business_name" in seller
    assert "match_score" in seller
    assert "priority" in seller
    assert "rating" in seller
    assert "verified" in seller
    assert "estimated_inventory" in seller
    assert "reasons" in seller
    assert "explanation" in seller