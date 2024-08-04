import requests

# Define the base URL for the API
BASE_URL = 'http://127.0.0.1:5000'

# Define the endpoints to test
endpoints = [
    '/login',
    '/places',
    '/places/1',  # Assuming place with ID 1 exists
]

def check_cors(url):
    response = requests.options(url)
    if 'Access-Control-Allow-Origin' in response.headers:
        print(f"CORS headers are present in the response for {url}")
        print("Access-Control-Allow-Origin:", response.headers['Access-Control-Allow-Origin'])
        print("Access-Control-Allow-Methods:", response.headers.get('Access-Control-Allow-Methods', 'Not Present'))
        print("Access-Control-Allow-Headers:", response.headers.get('Access-Control-Allow-Headers', 'Not Present'))
    else:
        print(f"CORS headers are NOT present in the response for {url}")

def test_cors():
    for endpoint in endpoints:
        url = BASE_URL + endpoint
        check_cors(url)

if __name__ == '__main__':
    test_cors()
