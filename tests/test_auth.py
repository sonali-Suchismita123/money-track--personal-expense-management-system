def test_register_success(client):
    res = client.post("/api/auth/register", json={
        "username": "newuser",
        "email": "new@example.com",
        "password": "Password123",
        "full_name": "New User"
    })
    assert res.status_code == 201
    data = res.get_json()
    assert data["user"]["email"] == "new@example.com"
    assert "password_hash" not in data["user"]


def test_register_duplicate_email(client, test_user):
    res = client.post("/api/auth/register", json={
        "username": "uniqueuser",
        "email": test_user.email,
        "password": "Password123"
    })
    assert res.status_code == 409


def test_login_success(client, test_user):
    res = client.post("/api/auth/login", json={
        "email": test_user.email,
        "password": "Password@123"
    })
    assert res.status_code == 200
    data = res.get_json()
    assert data["user"]["username"] == test_user.username


def test_login_invalid_password(client, test_user):
    res = client.post("/api/auth/login", json={
        "email": test_user.email,
        "password": "WrongPassword"
    })
    assert res.status_code == 401


def test_me_authenticated(auth_client, test_user):
    res = auth_client.get("/api/auth/me")
    assert res.status_code == 200
    assert res.get_json()["user"]["email"] == test_user.email


def test_logout(auth_client):
    res = auth_client.post("/api/auth/logout")
    assert res.status_code == 200
    res_me = auth_client.get("/api/auth/me")
    assert res_me.status_code == 401

