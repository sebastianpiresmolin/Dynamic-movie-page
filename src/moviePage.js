import { APIurl, settingsGet } from "../app.js";

// Function to get all upcoming screenings
async function movieScreening(response, page) {
  // Fetch the screenings from the API
  fetch(`${APIurl}${page}`, settingsGet)
    .then((response) => response.json())
    .then((json) => {
      // Create an object with all upcoming screenings
      const result = {
        screenings: json.data
          .filter((screening) => {
            // Convert the start_time to a Date object
            const startTime = new Date(screening.attributes.start_time);
            // Get today's date
            const today = new Date();
            // Remove the time from today's date
            today.setHours(0, 0, 0, 0);
            // Return true if the start_time is not earlier than today's date
            return startTime >= today;
          })
          .map((screening) => {
            // Split the start_time string to remove unwanted characters
            const parts = screening.attributes.start_time.split("T");
            const datePart = parts[0];
            const timeParts = parts[1].split("Z")[0].split(":");

            // Create a new start_time string without 'T', 'Z', and seconds
            const newStartTime = `${datePart} ${timeParts[0]}:${timeParts[1]}`;

            // Picking out the data we need
            console.log(newStartTime);
            return {
              id: screening.id,
              time: newStartTime,
              room: screening.attributes.room,
            };
          }),
      };
      response.json(result); // Send the result as JSON
    });
}

export default movieScreening;