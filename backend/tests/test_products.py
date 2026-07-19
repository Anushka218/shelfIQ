


def test_products(client):
    response = client.get("/api/products")

    assert response.status_code == 200

    data = response.json()

    assert "count" in data
    assert "results" in data