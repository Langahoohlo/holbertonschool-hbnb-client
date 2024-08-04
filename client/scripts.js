// Utility Functions
function fetchJSON(url, options = {}) {
  return fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }).then(response => {
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  });
}

function getJWTToken() {
  return localStorage.getItem('accessToken');
}

function setJWTToken(token) {
  localStorage.setItem('accessToken', token);
}

function removeJWTToken() {
  localStorage.removeItem('accessToken');
}

// Authentication Functions
function isAuthenticated() {
  return !!getJWTToken();
}

function updateAuthLink() {
  const authLink = document.getElementById('auth-link');
  if (isAuthenticated()) {
    authLink.innerHTML = `<a href="#" id="logout-link">Sign Out</a>`;
    document.getElementById('logout-link').addEventListener('click', (event) => {
      event.preventDefault();
      removeJWTToken();
      window.location.href = 'index.html';
    });
  } else {
    authLink.innerHTML = `<a href="login.html" id="login-link">Login</a>`;
  }
}

async function loginUser(email, password) {
  try {
    const data = await fetchJSON('http://localhost:5000/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setJWTToken(data.access_token);
    alert('Login successful!');
    window.location.href = 'index.html';
  } catch (error) {
    alert(`Login failed: ${error.message}`);
  }
}

// Place Functions
function displayPlaces(data) {
  const placesList = document.getElementById('places-list');
  placesList.innerHTML = '';

  data.forEach(place => {
    const placeContainer = document.createElement('div');
    placeContainer.className = 'flex flex-col border border-gray-300 p-4 rounded-lg shadow-sm cursor-pointer';
    placeContainer.addEventListener('click', () => {
      window.location.href = `place.html?place_id=${place.id}`;
    });

    const imgContainer = document.createElement('div');
    imgContainer.className = 'relative mb-4';
    const img = document.createElement('img');
    img.src = 'https://images.pexels.com/photos/13772652/pexels-photo-13772652.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
    img.alt = place.description;
    img.className = 'w-full h-48 object-cover rounded-md';
    imgContainer.appendChild(img);

    const starIcon = document.createElement('i');
    starIcon.className = 'fas fa-star text-white absolute top-2 right-2';
    imgContainer.appendChild(starIcon);

    const location = document.createElement('p');
    location.className = 'text-lg font-bold mb-1';
    location.textContent = `${place.city_name}, ${place.country_name}`;

    const description = document.createElement('p');
    description.className = 'text-gray-600 mb-2';
    description.textContent = place.description;

    const price = document.createElement('p');
    price.className = 'text-gray-800 font-semibold';
    price.textContent = place.price;

    placeContainer.appendChild(imgContainer);
    placeContainer.appendChild(location);
    placeContainer.appendChild(description);
    placeContainer.appendChild(price);
    placesList.appendChild(placeContainer);
  });
}

function populateCountryFilter(data) {
  const countryFilter = document.getElementById('country-filter');
  const uniqueCountries = Array.from(new Set(data.map(place => place.country_name)));
  countryFilter.innerHTML = '<option value="all">All Countries</option>';
  uniqueCountries.forEach(country => {
    const option = document.createElement('option');
    option.value = country;
    option.textContent = country;
    countryFilter.appendChild(option);
  });
}

function filterPlacesByCountry(country, placesData) {
  if (country === 'all') {
    displayPlaces(placesData);
  } else {
    const filteredData = placesData.filter(place => place.country_name === country);
    displayPlaces(filteredData);
  }
}

async function fetchPlaceDetails(placeId) {
  try {
    const place = await fetchJSON(`http://localhost:5000/places/${placeId}`);
    populatePlaceDetails(place);
  } catch (error) {
    console.error('Error fetching place details:', error);
  }
}

function populatePlaceDetails(place) {
  const imageElement = document.querySelector('#place-details img');
  imageElement.src = 'https://images.unsplash.com/photo-1499678329028-101435549a4e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
  const detailsElement = document.querySelector('#place-details div:nth-of-type(2)');
  detailsElement.innerHTML = `
    <p><strong>Host:</strong> ${place.host_name}</p>
    <p><strong>Price per night:</strong> $${place.price_per_night}</p>
    <p><strong>Location:</strong> ${place.city_name}, ${place.country_name}</p>
    <p><strong>Description:</strong> ${place.description}</p>
    <p><strong>Amenities:</strong> ${place.amenities.join(', ')}</p>
  `;
  const reviewsSection = document.querySelector('#reviews');
  reviewsSection.innerHTML = place.reviews.length > 0 ? place.reviews.map(review => `
    <div>
      <h1>${review.author}</h1>
      <p>${review.text}</p>
      <p>Rating: ${review.rating}</p>
    </div>
  `).join('') : '<p>No reviews yet</p>';
}

// Event Handlers
document.addEventListener('DOMContentLoaded', () => {
  // Handle fetching and displaying places
  let placesData = [];
  fetchJSON('http://localhost:5000/places')
    .then(data => {
      placesData = data;
      populateCountryFilter(data);
      displayPlaces(data);
    })
    .catch(error => console.error('Error fetching places data:', error));

  // Handle country filter change
  document.getElementById('country-filter').addEventListener('change', event => {
    filterPlacesByCountry(event.target.value, placesData);
  });

  // Handle login form submission
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', event => {
      event.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      loginUser(email, password);
    });
  }

  // Update auth link
  updateAuthLink();

  // Handle fetching and displaying place details
  const placeId = new URLSearchParams(window.location.search).get('place_id');
  if (placeId) fetchPlaceDetails(placeId);

  // Handle review form submission
  const reviewForm = document.getElementById('review-form');
  if (reviewForm) {
    reviewForm.addEventListener('submit', event => {
      event.preventDefault();
      const reviewText = document.getElementById('review-text').value;
      const rating = document.getElementById('styledDropdown').value;
      const token = getJWTToken();

      if (!token) {
        alert('Please login to submit a review.');
        return;
      }

      fetchJSON(`http://localhost:5000/places/${placeId}/reviews`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ review_text: reviewText, rating }),
      })
        .then(() => {
          alert('Review submitted successfully!');
          fetchPlaceDetails(placeId);
        })
        .catch(error => console.error('Error submitting review:', error));
    });
  }
});
