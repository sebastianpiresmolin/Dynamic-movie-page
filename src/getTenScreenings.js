export default async function getRecentReviews(cmsAdapter) {
  const screenings = await cmsAdapter.loadAllScreenings();
    console.log(screenings);
  return screenings
  .filter((screening) => {
    console.log(screening);
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
  });
}
