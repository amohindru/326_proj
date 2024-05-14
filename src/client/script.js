var db = new PouchDB('resultsDB'); 

/**
 * handles the form submission by fetching results from server
 */
function handleFormSubmission() {
  var searchForm = document.getElementById('search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', function(event) {
      event.preventDefault(); 
      console.log('Form submitted'); 
      var location = document.getElementById('location').value;
      var maxDistance = document.getElementById('max-distance').value;
      console.log('Location:', location);
      console.log('Max Distance:', maxDistance);
      fetch(`/api/results?location=${encodeURIComponent(location)}&maxDistance=${maxDistance}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(results => {
          console.log('Results fetched:', results);
          saveResults(results); 
          console.log('Redirecting to results.html');
          window.location.href = `results.html?location=${encodeURIComponent(location)}&maxDistance=${maxDistance}`;
        })
        .catch(error => console.error('Error fetching results:', error));
    });
  }
}

/**
 * displays search results on results page
 * @param {string} location - location to search for food banks within a certain distance
 * @param {number} maxDistance - max distance to search within
 */
function displayResults(location, maxDistance) {
  console.log('Displaying results for:', location, maxDistance); 
  let resultsList = document.getElementById('results-list');
  if (!resultsList) return; 
  document.getElementById('mile-radius').textContent = maxDistance + ' miles';
  fetch(`/api/results?location=${encodeURIComponent(location)}&maxDistance=${maxDistance}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(results => {
      console.log('Results:', results); 
      updateResultsList(results);
      saveResults(results);
    })
    .catch(error => console.error('Error fetching results:', error));
}

/**
 * updates result list on results page
 * @param {Object[]} results - array of results to display
 */
function updateResultsList(results) {
  let resultsList = document.getElementById('results-list');
  resultsList.innerHTML = ''; 
  results.forEach(function(result) {
    let li = document.createElement('li');
    li.textContent = result.name;
    li.addEventListener('click', function() {
      window.location.href = `details.html?name=${encodeURIComponent(result.name)}&address=${encodeURIComponent(result.address)}`;
    });
    resultsList.appendChild(li);
  });
}

/**
 * saves search results to PouchDB
 * @param {Object[]} results - array of results to save
 */
function saveResults(results) {
  db.put({
    _id: 'lastResults',
    results: results
  }).catch(function(err) {
    if (err.name === 'conflict') {
      db.get('lastResults').then(function(doc) {
        return db.put({
          _id: 'lastResults',
          _rev: doc._rev,
          results: results
        });
      }).catch(function(err) {
        console.log(err);
      });
    } else {
      console.log(err);
    }
  });
}

/**
 * displays results on results page
 */
function showDetail() {
  let params = new URLSearchParams(window.location.search);
  let name = params.get('name');
  let address = params.get('address');
  if (name && address) {
    name = decodeURIComponent(name); 
    address = decodeURIComponent(address); 
    let locationName = document.getElementById('location-name');
    let aboutLocation = document.getElementById('about-location');
    if (locationName && aboutLocation) {
      locationName.textContent = name;
      aboutLocation.textContent = `Address: ${address}`;
    }
  }
}

document.addEventListener('DOMContentLoaded', function() { 
  if (window.location.pathname.endsWith('/') || window.location.pathname.endsWith('/index.html')) {
    handleFormSubmission();
  } else if (window.location.pathname.endsWith('/results.html')) {
    let params = new URLSearchParams(window.location.search);
    let location = params.get('location');
    let maxDistance = params.get('maxDistance');
    if (location && maxDistance) {
      displayResults(location, maxDistance);
    }
  } else if (window.location.pathname.endsWith('/details.html')) {
    showDetail();
  }
});
