// Function to get the screenings for the home page
async function homeScreening(getTenScreeningsAdapter) {
  const screenings = await getTenScreeningsAdapter.loadAllMovieScreenings();

  const result = screenings
    .filter((screening) => {
      // Convert the start_time to a Date object
      const startTime = new Date(screening.attributes.start_time);
      // Get today's date
      const today = new Date();
      // Get the date for the upcoming five days
      const fiveDays = new Date();
      fiveDays.setDate(fiveDays.getDate() + 5);
      // Remove the time from today's date
      today.setHours(0, 0, 0, 0);
      // Return true if the start_time is not earlier than today's date and not later than five days from today
      return startTime >= today && startTime <= fiveDays;
    })
    .map((screening) => {
      // Split the start_time string to remove unwanted characters
      const parts = screening.attributes.start_time.split('T');
      const datePart = parts[0];
      const timeParts = parts[1].split('Z')[0].split(':');

      // Create a new start_time string without 'T', 'Z' and seconds
      const newStartTime = `${datePart} ${timeParts[0]}:${timeParts[1]}`;

      // Picking out the data we need
      return {
        id: screening.id,
        movieId: screening.attributes.movie.data.id,
        time: newStartTime,
        room: screening.attributes.room,
        image: screening.attributes.movie.data.attributes.image.url,
        title: screening.attributes.movie.data.attributes.title,
      };
    })
    .slice(0, 10); // Only return the first 10 screenings
  return result;
}

export default homeScreening;
