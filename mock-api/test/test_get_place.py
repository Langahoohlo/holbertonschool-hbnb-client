import requests, json

url = "http://127.0.0.1:5000/places/{}"

# Test with a valid place ID
place_id = "place-1"
response = requests.get(url.format(place_id))
if response.status_code == 200:
    print(f"Details for place ID {place_id}:\n")
    print(json.dumps(response.json(), indent=4))
else:
    print(f"Failed to get details for place ID {place_id}: {response.status_code}")
    print(f"Response: {response.json()}")

# Test with an invalid place ID
place_id = "invalid-place-id"
response = requests.get(url.format(place_id))
if response.status_code == 404:
    print(f"Correctly handled missing place ID {place_id}: {response.status_code}\n")
    print(f"Response: {response.json()}")
else:
    print(f"Unexpected response for missing place ID {place_id}: {response.status_code}")
    print(f"Response: {response.json()}")