from __future__ import annotations


def test_signup_login_me(client):
    payload = {"email": "learner@example.com", "password": "SuperSecure!123"}

    signup_response = client.post("/auth/signup", json=payload)
    assert signup_response.status_code == 201
    signup_body = signup_response.json()["user"]
    assert signup_body["email"] == payload["email"]
    assert signup_body["isAdmin"] is False

    login_response = client.post("/auth/login", json=payload)
    assert login_response.status_code == 200

    me_response = client.get("/auth/me")
    assert me_response.status_code == 200
    me_body = me_response.json()["user"]
    assert me_body["email"] == payload["email"]


def test_login_invalid_password(client):
    payload = {"email": "learner2@example.com", "password": "SuperSecure!123"}
    client.post("/auth/signup", json=payload)

    bad_login = client.post(
        "/auth/login",
        json={"email": payload["email"], "password": "NotTheRightPassword"},
    )
    assert bad_login.status_code == 401
