



def test_filter(client):
    response = client.get(
        "/api/products/filter?category=kurta"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["count"] >= 0