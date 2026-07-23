def test_shelf(client):
    response = client.get("/api/shelf/Lucknow")

    assert response.status_code == 200

    data = response.json()

    assert "recommendations" in data