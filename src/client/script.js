var db = new PouchDB('resultsDB');

/**
 * Sets up event listener for search form
 */
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

/**
 * Displays search results by location and distance and using PouchDB
 * @param {string} location - The location to display results for
 * @param {number} maxDistance - The maximum distance for searching
 */
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

/**
 * Updates the UI with a list of results
 * @param {Array<string>} results - Array of result names to display
 */
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

/**
 * Saves search results to PouchDB
 * @param {Array<string>} results - Array of results to save
 */
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

/**
 * Displays details for a specific result
 */
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
