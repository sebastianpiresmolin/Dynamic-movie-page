// Function to show upcoming screenings 
async function moviePage(response, cmsAdapter, queryString) {
  
  // Fetch screenings from cmsAdapter
  const screenings = await cmsAdapter.loadScreenings(queryString);

  // Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter screenings
  const result = {
    screenings: screenings
      .filter((screening) => {
        // Convert the start_time to a Date object
        const startTime = new Date(screening.attributes.start_time);
        // Check if the screening's start time is after or equal to today
        return startTime >= today;
      })
      .map((screening) => {
        // Split the start_time string to remove unwanted characters
        const parts = screening.attributes.start_time.split("T");
        const datePart = parts[0];
        const timeParts = parts[1].split("Z")[0].split(":");
        // Create a new start_time string without 'T', 'Z', and seconds
        const newStartTime = `${datePart} ${timeParts[0]}:${timeParts[1]}`;
        return {
          id: screening.id,
          time: newStartTime,
          room: screening.attributes.room,
        };
      }),
  };
  response.json(result);
}


export default moviePage;
