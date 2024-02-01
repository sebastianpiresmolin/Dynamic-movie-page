export default async function getTenScreenings(getTenScreeningsAdapter) {
  const screenings = await getTenScreeningsAdapter.loadAllScreenings();
  return screenings
    .filter((screening) => {
      // Convert the start_time to a Date object
      const startTime = new Date(screening.time);
      // Get today's date
      const today = new Date();
      // Get the date for the upcoming five days
      const fiveDays = new Date();
      fiveDays.setDate(fiveDays.getDate() + 5);
      // Remove the time from today's date
      today.setHours(0, 0, 0, 0);
      fiveDays.setHours(0, 0, 0, 0);

      // Return true if the start_time is not earlier than today's date and not later than five days from today
      return startTime >= today && startTime <= fiveDays;
    })
    .map((screenings) => {
      // Split the start_time string to remove unwanted characters
      const parts = screenings.time.split('T');
      const datePart = parts[0];
      const timeParts = parts[1].split('Z')[0].split(':');

      // Create a new start_time string without 'T', 'Z' and seconds
      const newStartTime = `${datePart} ${timeParts[0]}:${timeParts[1]}`;

      // Picking out the data we need
      return {
        id: screenings.id,
        movieId: screenings.attributes.movie.data.id,
        time: newStartTime,
        room: screenings.attributes.room,
        image: screenings.attributes.movie.data.attributes.image.url,
        title: screenings.attributes.movie.data.attributes.title,
      };
    })
    .slice(0, 10);
}
