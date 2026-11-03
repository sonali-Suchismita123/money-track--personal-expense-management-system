def test_savings_lifecycle(auth_client):
    # Create a goal
    res = auth_client.post("/api/savings", json={
        "title": "New Phone",
        "target_amount": 30000.0,
        "current_amount": 5000.0,
        "deadline": "2026-12-31"
    })
    assert res.status_code == 201
    goal = res.get_json()["savings_goal"]
    goal_id = goal["id"]
    assert goal["progress_percentage"] > 0

    # Add funds
    add_res = auth_client.post(f"/api/savings/{goal_id}/add", json={
        "amount": 2500.0
    })
    assert add_res.status_code == 200
    assert add_res.get_json()["savings_goal"]["current_amount"] == 7500.0

