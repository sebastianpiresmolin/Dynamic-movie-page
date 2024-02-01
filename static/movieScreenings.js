// Function to get ID from URL
function getMovieId() {
  const path = window.location.pathname.split("/");
  const movieIdIndex = path.indexOf("movie") + 1;

  // Check if 'movie' is present in the path and get ID
  if (movieIdIndex > 0 && movieIdIndex < path.length) {
    return path[movieIdIndex];
  }

  return null;
}

// Function to update HTML with screenings
function updateScreenings(data) {
  const screeningsContainer = document.getElementById("screeningsContainer");

  // Clear previous content (OBS! is this nessesary?)
  screeningsContainer.innerHTML = "";

  // Check if the 'screenings' property is present and is an array
  if (data && data.screenings && Array.isArray(data.screenings)) {
    // Create and append new content
    const screeningsList = document.createElement("ul");

    data.screenings.forEach((screening) => {
      const screeningItem = document.createElement("li");
      screeningItem.textContent = `${screening.time} - ${screening.room}`;
      screeningsList.appendChild(screeningItem);
    });

    screeningsContainer.appendChild(screeningsList);
  } else {
    // Handle the case where the data structure is not as expected
    console.error("Invalid data format:", data);
    screeningsContainer.textContent = "Error: Invalid data format";
  }
}

// Listen for changes in the URL
window.addEventListener("popstate", function () {
  const changedMovieId = getMovieId();

  if (changedMovieId) {
    // Fetch screenings using dynamic ID
    fetch(`/movie/${changedMovieId}/screenings`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Update HTML with changed data
        updateScreenings(data);
      })
      .catch((error) => {
        console.error("Error fetching screenings:", error);
      });
  }
});

// Call the function when the page is loaded for the first time
const movieId = getMovieId();

if (movieId) {
  // Fetch screenings using dynamic ID
  fetch(`/movie/${movieId}/screenings`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // Update HTML with initial data
      updateScreenings(data);
    })
    .catch((error) => {
      console.error("Error fetching screenings:", error);
    });
}