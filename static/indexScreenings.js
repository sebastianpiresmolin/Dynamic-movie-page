let screenings;

async function screening() {
  const response = await fetch('/app/home/screenings');
  screenings = await response.json();
  return screenings;
}

window.onload = async function () {
  const result = await screening();
  console.log(result);
  for (let i = 0; i < result.screenings.length; i++) {
    let li = document.createElement('li');
    let a = document.createElement('a');
    a.href = `./movie/${result.screenings[i].movieId}`;
    a.textContent = result.screenings[i].title;

    let img = document.createElement('img');
    img.src = result.screenings[i].image;
    img.classList.add('screening-image');
    a.appendChild(img);

    let room = document.createElement('p');
    room.textContent = result.screenings[i].room;
    room.classList.add('room');

    let date = document.createElement('p');
    date.textContent = result.screenings[i].time;
    date.classList.add('date');

    li.appendChild(a);
    li.appendChild(room);
    li.appendChild(date);
    li.classList.add('screening');
    console.log(result.screenings[i]);
    document.getElementById('screenings').appendChild(li);
  }
};
