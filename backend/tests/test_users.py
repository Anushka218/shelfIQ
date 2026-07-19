


def test_invalid_user(client):
    response = client.get("/api/users/user_99999/affinity")

    assert response.status_code == 404
    assert response.json() == {
        "detail": "User not found"
    }