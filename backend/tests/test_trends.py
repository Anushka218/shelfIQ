def test_invalid_region(client):
    response = client.get("/api/trends/Mars")

    assert response.status_code == 404

    data = response.json()
    assert "detail" in data
    assert "Region" in data["detail"]
    assert "Mars" in data["detail"]