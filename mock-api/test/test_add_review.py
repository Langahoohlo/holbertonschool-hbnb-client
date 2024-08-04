import requests

login_url = "http://127.0.0.1:5000/login"
add_review_url = "http://127.0.0.1:5000/places/{}/reviews"

# Log in as a valid user
user = {"email": "john@example.com", "password": "password123"}
response = requests.post(login_url, json=user)
if response.status_code == 200:
    token = response.json()['access_token']
    headers = {'Authorization': f'Bearer {token}'}
    print("Logged in successfully\n")
else:
    print("Login failed")
    print(f"Response: {response.json()}")
    exit()

# Add a review to a valid place
place_id = "place-1"
review = {
    "rating": 5,
    "review": "This place was fantastic!"
}
response = requests.post(add_review_url.format(place_id), json=review, headers=headers)
if response.status_code == 201:
    print(f"Review added successfully for place ID {place_id}\n")
else:
    print(f"Failed to add review for place ID {place_id}: {response.status_code}")
    print(f"Response: {response.json()}")

# Try to add a review without a valid token
response = requests.post(add_review_url.format(place_id), json=review)
if response.status_code == 401:
    print(f"Correctly handled missing authentication for place ID {place_id}: {response.status_code}\n")
    print(f"Response: {response.json()}")
else:
    print(f"Unexpected response for missing authentication for place ID {place_id}: {response.status_code}")
    print(f"Response: {response.json()}")