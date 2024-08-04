import requests, json

url = "http://127.0.0.1:5000/places"

response = requests.get(url)
if response.status_code == 200:
    places = response.json()
    print(f"Number of places: {len(places)}\n")
    for place in places:
        print(json.dumps(place, indent=4))
else:
    print(f"Failed to get places: {response.status_code}")
    print(f"Response: {response.json()}")