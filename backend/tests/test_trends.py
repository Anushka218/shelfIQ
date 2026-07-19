
def test_invalid_region(client):
    response = client.get("/api/trends?region=Mars")

    assert response.status_code == 404
    assert response.json() == {
        "detail": "Region not found"
    }