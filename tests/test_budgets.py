def test_create_and_get_budget(auth_client):
    # First get a category
    cat_res = auth_client.get("/api/categories")
    cat_id = cat_res.get_json()["categories"][0]["id"]

    create_res = auth_client.post("/api/budgets", json={
        "category_id": cat_id,
        "amount": 5000.0,
        "month": 11,
        "year": 2026
    })
    assert create_res.status_code == 201
    b_data = create_res.get_json()["budget"]
    assert b_data["amount"] == 5000.0
    assert b_data["spent"] == 0.0

    # Get budgets
    list_res = auth_client.get("/api/budgets?month=11&year=2026")
    assert list_res.status_code == 200
    assert len(list_res.get_json()["budgets"]) == 1

