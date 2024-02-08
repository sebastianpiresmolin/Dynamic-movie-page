let screenings;

async function screening() {
  const response = await fetch('/api/home/screenings');
  screenings = await response.json();
  return screenings;
}

window.onload = async function () {
  if (window.location.pathname === '/') {
    const result = await screening();
    for (let i = 0; i < result.length; i++) {
      let li = document.createElement('li');
      let a = document.createElement('a');
      a.href = `./movie/${result[i].movieId}`;
      a.textContent = result[i].title;

      let img = document.createElement('img');
      img.src = result[i].image;
      img.classList.add('screening-image');
      a.appendChild(img);

      let room = document.createElement('p');
      room.textContent = result[i].room;
      room.classList.add('room');

      let date = document.createElement('p');
      date.textContent = result[i].time;
      date.classList.add('date');

      li.appendChild(a);
      li.appendChild(room);
      li.appendChild(date);
      li.classList.add('screening');
      document.getElementById('screenings').appendChild(li);
    }
  }
};
