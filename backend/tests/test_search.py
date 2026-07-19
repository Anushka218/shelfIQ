


def test_search(client):
    response = client.get("/api/search?q=kurta")

    assert response.status_code == 200

    data = response.json()

    assert "results" in data