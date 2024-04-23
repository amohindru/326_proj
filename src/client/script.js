document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    // Fetch and display search results
    let location = document.getElementById('location').value;
    let maxDistance = document.getElementById('max-distance').value;
    displayResults(location, maxDistance);
  });
  
  function displayResults(location, maxDistance) {
    // This function should make an AJAX request to your backend
    // For now, it just hides the home div and shows the results div
    document.getElementById('home').style.display = 'none';
    document.getElementById('results').style.display = 'block';
    document.getElementById('mile-radius').textContent = maxDistance;
    // Update the results list
    let resultsList = document.getElementById('results-list');
    resultsList.innerHTML = ''; // Clear previous results
    // This should be replaced with actual results from the backend
    let sampleResults = ['Nancy\'s Kitchen', 'Amherst Survival Center', 'Northampton Survival Center', 'Brookfield Farm'];
    sampleResults.forEach(function(result) {
      let li = document.createElement('li');
      li.textContent = result;
      li.addEventListener('click', function() {
        showDetail(result);
      });
      resultsList.appendChild(li);
    });
  }
  
  function showDetail(resultName) {
    // Hide results and show detail for the clicked result
    document.getElementById('results').style.display = 'none';
    let detailDiv = document.getElementById('detail');
    detailDiv.style.display = 'block';
    // Populate with details of the clicked result
    document.getElementById('location-name').textContent = resultName;
    // The rest of the details would come from the backend
  }
  