def test_reports_summary(auth_client):
    # Add income
    auth_client.post("/api/transactions", json={
        "type": "income",
        "amount": 50000.0,
        "description": "Salary",
        "date": "2026-11-01"
    })
    # Add expense
    auth_client.post("/api/transactions", json={
        "type": "expense",
        "amount": 12000.0,
        "description": "Rent",
        "date": "2026-11-02"
    })

    res = auth_client.get("/api/reports/summary?month=11&year=2026")
    assert res.status_code == 200
    data = res.get_json()
    assert data["total_income"] == 50000.0
    assert data["total_expense"] == 12000.0
    assert data["balance"] == 38000.0
    assert data["transaction_count"] == 2

