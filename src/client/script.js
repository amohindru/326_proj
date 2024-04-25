// Initialize a new PouchDB instance
var db = new PouchDB('resultsDB');

// Function to handle form submission on index.html
function handleFormSubmission() {
  var searchForm = document.getElementById('search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', function(event) {
      event.preventDefault();
      var location = document.getElementById('location').value;
      var maxDistance = document.getElementById('max-distance').value;
      window.location.href = 'results.html?location=' + encodeURIComponent(location) + '&maxDistance=' + maxDistance;
    });
  }
}

// Function to display results on results.html
function displayResults(location, maxDistance) {
  let resultsList = document.getElementById('results-list');
  if (!resultsList) return; // Exit if resultsList is not part of the current DOM

  document.getElementById('mile-radius').textContent = maxDistance + ' miles';
  
  // Try to fetch results from local database
  db.get('lastResults').then(function(doc) {
    updateResultsList(doc.results);
  }).catch(function(err) {
    if (err.name === 'not_found') {
      // No results in DB, load default results and save them
      let sampleResults = ['Nancy\'s Kitchen', 'Amherst Survival Center', 'Northampton Survival Center', 'Brookfield Farm'];
      updateResultsList(sampleResults);
      saveResults(sampleResults);
    } else { // Handle other errors
      console.log(err);
    }
  });
}

// Update the results list UI
function updateResultsList(results) {
  let resultsList = document.getElementById('results-list');
  resultsList.innerHTML = ''; // Clear previous results

  results.forEach(function(result) {
    let li = document.createElement('li');
    li.textContent = result;
    li.addEventListener('click', function() {
      window.location.href = 'details.html?resultName=' + encodeURIComponent(result);
    });
    resultsList.appendChild(li);
  });
}

// Save results to PouchDB
function saveResults(results) {
  // Save the current state of results
  db.put({
    _id: 'lastResults',
    results: results
  }).catch(function(err) {
    if (err.name === 'conflict') {
      // handle conflict if old data exists
      db.get('lastResults').then(function(doc) {
        return db.put({
          _id: 'lastResults',
          _rev: doc._rev, // include the revision to update the document
          results: results
        });
      }).catch(function(err) {
        console.log(err);
      });
    }
    console.log(err);
  });
}

// Function to show details on detail.html
function showDetail() {
  let params = new URLSearchParams(window.location.search);
  let resultName = params.get('resultName');
  if (resultName) {
    resultName = decodeURIComponent(resultName); // Decode the resultName
    let locationName = document.getElementById('location-name');
    let aboutLocation = document.getElementById('about-location');
    if (locationName && aboutLocation) {
      locationName.textContent = resultName;
      // Dummy detail just as a placeholder
      aboutLocation.textContent = "Information and services provided at " + resultName;
    }
  }
}

// Event listener for DOMContentLoaded to initialize page-specific functionality
document.addEventListener('DOMContentLoaded', function() {
  if (window.location.pathname.includes('index.html')) {
    handleFormSubmission();
  } else if (window.location.pathname.includes('results.html')) {
    let params = new URLSearchParams(window.location.search);
    let location = params.get('location');
    let maxDistance = params.get('maxDistance');
    if (location && maxDistance) {
      displayResults(location, maxDistance);
    }
  } else if (window.location.pathname.includes('details.html')) {
    showDetail();
  }
});
