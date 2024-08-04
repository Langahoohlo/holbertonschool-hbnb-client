# Simple Testing API for HBnB Evolution Part 3

This is a simple testing API for the HBnB Evolution part 3. The API serves as a backend for testing the frontend functionality of the HBnB Evolution project. It provides endpoints for user authentication, fetching places, fetching place details, and adding reviews.

## Project Structure

```
api/
│
├── data/
│   ├── places.json
│   ├── users.json
│   ├── cities.json
│   └── countries.json
│
├── app.py
├── config.py
├── requirements.txt
└── README.md
```

### Data Files

- `data/users.json`: Contains user data including emails and plain text passwords.
- `data/places.json`: Contains place data with various attributes and some sample reviews.
- `data/cities.json`: Contains city data linked to countries.
- `data/countries.json`: Contains country data.

### API Endpoints

#### POST `/login`

Authenticates a user and returns a JWT token.

- **Request Body:**
  ```json
  {
      "email": "user@example.com",
      "password": "password"
  }
  ```

- **Response:**
  ```json
  {
      "access_token": "your_jwt_token"
  }
  ```

#### GET `/places`

Returns a list of places with general information.

- **Response:**
  ```json
  [
      {
          "id": "place-1",
          "host_id": "user-1",
          "host_name": "John Doe",
          "description": "A lovely place to stay.",
          "price_per_night": 100.0,
          "city_id": "city-1",
          "city_name": "New York",
          "country_code": "US",
          "country_name": "United States"
      },
      ...
  ]
  ```

#### GET `/places/{id}`

Returns detailed information about a specific place.

- **Response:**
  ```json
  {
      "id": "place-1",
      "host_id": "user-1",
      "host_name": "John Doe",
      "description": "A lovely place to stay.",
      "number_of_rooms": 3,
      "number_of_bathrooms": 2,
      "max_guests": 6,
      "price_per_night": 100.0,
      "latitude": 40.7128,
      "longitude": -74.0060,
      "city_id": "city-1",
      "city_name": "New York",
      "country_code": "US",
      "country_name": "United States",
      "amenities": ["WiFi", "Pool", "Air Conditioning"],
      "reviews": [
          {
              "user_name": "Jane Smith",
              "rating": 5,
              "comment": "Amazing place, very clean and comfortable."
          },
          ...
      ]
  }
  ```

#### POST `/places/{id}/reviews`

Adds a review for a specific place. Requires authentication.

- **Request Headers:**
  ```http
  Authorization: Bearer your_jwt_token
  ```

- **Request Body:**
  ```json
  {
      "rating": 5,
      "review": "This place was fantastic!"
  }
  ```

- **Response:**
  ```json
  {
      "msg": "Review added"
  }
  ```

## Instructions to Run the API

### Create a Virtual Environment

It is recommended to create a virtual environment to manage the Python packages. Follow these steps:

1. **Create a virtual environment:**

   ```sh
   python -m venv venv
   ```

2. **Activate the virtual environment:**

   - On Windows:
     ```sh
     venv\Scripts\activate
     ```
   - On macOS and Linux:
     ```sh
     source venv/bin/activate
     ```

3. **Install Dependencies:**

   Ensure you have Python and `pip` installed. Then run:

   ```sh
   pip install -r requirements.txt
   ```

4. **Run the Flask Server:**

   ```sh
   python app.py
   ```

   The server will start running at `http://127.0.0.1:5000`.

## Testing the API

You can use the provided test scripts in the `test` directory to verify the functionality of the API. Ensure the server is running, and then execute the test scripts. Note that the `requests` package must be installed to use the test scripts:

```sh
pip install requests
```

Then run the test scripts:

```sh
python test_login.py
python test_get_places.py
python test_get_place.py
python test_add_review.py
python test_cors.py
```

These scripts will make HTTP requests to the API endpoints and print the results, helping you ensure that each part of the API is working as expected.

## Notes

- This API uses plain text passwords for simplicity and ease of testing. In a production environment, always use hashed passwords and secure authentication mechanisms.
- The data provided in the `data/` directory is for testing purposes only. Modify the data as needed to fit your testing scenarios.