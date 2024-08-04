import requests
import json

url = "http://127.0.0.1:5000/login"

# Test data
users = [
    {"email": "john@example.com", "password": "password123"},
    {"email": "jane@example.com", "password": "mysecurepassword"},
    {"email": "alice@example.com", "password": "alicepassword"},
    {"email": "invalid@example.com", "password": "wrongpassword"}
]

for user in users:
    response = requests.post(url, json=user)
    if response.status_code == 200:
        print(f"Login successful for {user['email']}")
        print(f"Token: {response.json()['access_token']}\n")
    else:
        print(f"Login failed for {user['email']}")
        print(f"Response: {response.json()}\n")