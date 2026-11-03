def test_get_categories(auth_client):
    res = auth_client.get("/api/categories")
    assert res.status_code == 200
    data = res.get_json()
    # Should contain system categories seeded at startup
    assert len(data["categories"]) > 0


def test_create_custom_category(auth_client):
    res = auth_client.post("/api/categories", json={
        "name": "Gym & Fitness",
        "type": "expense",
        "icon": "💪",
        "color": "#FF6584"
    })
    assert res.status_code == 201
    data = res.get_json()
    assert data["category"]["name"] == "Gym & Fitness"
    assert data["category"]["user_id"] is not None

