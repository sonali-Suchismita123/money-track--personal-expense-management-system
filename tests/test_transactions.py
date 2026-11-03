def test_create_transaction(auth_client):
    res = auth_client.post("/api/transactions", json={
        "type": "expense",
        "amount": 250.0,
        "description": "Coffee and Snack",
        "date": "2026-11-01"
    })
    assert res.status_code == 201
    data = res.get_json()
    assert data["transaction"]["amount"] == 250.0
    assert data["transaction"]["description"] == "Coffee and Snack"


def test_get_transactions(auth_client):
    # Add an income and expense
    auth_client.post("/api/transactions", json={
        "type": "income",
        "amount": 1000.0,
        "description": "Tutoring",
        "date": "2026-11-01"
    })
    auth_client.post("/api/transactions", json={
        "type": "expense",
        "amount": 150.0,
        "description": "Book",
        "date": "2026-11-01"
    })

    res = auth_client.get("/api/transactions")
    assert res.status_code == 200
    data = res.get_json()
    assert len(data["transactions"]) >= 2


def test_delete_transaction(auth_client):
    create_res = auth_client.post("/api/transactions", json={
        "type": "expense",
        "amount": 50.0,
        "description": "Pen",
        "date": "2026-11-01"
    })
    tx_id = create_res.get_json()["transaction"]["id"]

    del_res = auth_client.delete(f"/api/transactions/{tx_id}")
    assert del_res.status_code == 200

    get_res = auth_client.get(f"/api/transactions/{tx_id}")
    assert get_res.status_code == 404

