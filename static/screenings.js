let screenings = [];

async function screening() {
  const response = await fetch(
    '/app/home/screenings'
  );
  screenings = await response.json();
  return screenings;
}

window.onload = async function () {
  const result = await screening();
  console.log(result);
  console.log(screenings);
};
