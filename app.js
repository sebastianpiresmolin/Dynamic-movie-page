import express from 'express';
import { engine } from 'express-handlebars';
import fetch from 'node-fetch';

// API URL's
const movieUrl = 'https://plankton-app-xhkom.ondigitalocean.app/api/movies';
const screeningUrl =
  'https://plankton-app-xhkom.ondigitalocean.app/api/screenings';

// fetch settings
const settingsGet = { method: 'Get' };

const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './templates');

app.use(express.static('static'));

const MENU = [
  { name: 'Home', link: '/' },
  { name: 'About', link: '/about' },
  { name: 'Contact', link: '/contact' },
  { name: 'Movies', link: '/movies' },
];

const images = [
  {
    index:
      'https://static01.nyt.com/images/2023/12/12/climate/12cli-cats/12cli-cats-jumbo.jpg?quality=75&auto=webp',
  },
  {
    about: 'https://www.alleycat.org/wp-content/uploads/2019/03/FELV-cat.jpg',
  },
  {
    contact:
      'https://static.scientificamerican.com/sciam/cache/file/32665E6F-8D90-4567-9769D59E11DB7F26_source.jpg?w=900',
  },
];

async function renderPage(response, page) {
  //Check to see if current page is index and also check which page is active so that I know which image to serve.
  const currentPath = page == 'index' ? '/' : `/${page}`;
  page === '/' ? 0 : page === 'about' ? 1 : page === 'contact' ? 2 : 0;

  if (page === 'movies') {
    fetch(movieUrl, settingsGet)
      .then((response) => response.json())
      .then((json) => {
        response.render(page, {
          movieIDs: json.data.map((movies) => {
            return {
              id: movies.id,
              title: movies.attributes.title,
              intro: movies.attributes.intro,
              image: movies.attributes.image.url,
            };
          }),
          menuItems: MENU.map((item) => {
            return {
              active: currentPath == item.link,
              name: item.name,
              link: item.link,
            };
          }),
        });
      });
  } else if (page.startsWith('/movie/')) {
    const id = page.split('/')[2]; // Get the id from the URL
    fetch(`${movieUrl}/${id}`, settingsGet) // Fetch the data for the specific movie
      .then((response) => {
        if (!response.ok) {
          // Check if response was successful
          throw new Error('Network response was not ok'); // Throw an error if not
        }
        return response.json();
      })
      .then((json) => {
        if (!json.data) {
          // Check if data exists
          throw new Error('No data found'); // Throw an error if not
        }
        response.render('movie', {
          // Render the 'movie' view
          movie: {
            id: json.data.id,
            title: json.data.attributes.title,
            intro: json.data.attributes.intro,
            image: json.data.attributes.image.url,
          },
          menuItems: MENU.map((item) => {
            return {
              active: currentPath == item.link,
              name: item.name,
              link: item.link,
            };
          }),
        });
      })
      .catch((error) => {
        // Catch any errors
        console.error('Fetch Error:', error);
        response.status(404);
        renderPage(response, '404');
      });
  } else {
    const activePage = page === '/' ? index : page;
    const currentPath = page == 'index' ? '/' : `/${page}`;
    const activeImage =
      page === '/' ? 0 : page === 'about' ? 1 : page === 'contact' ? 2 : 0;
    const activeImageIndex = images[activeImage][activePage];
    response.render(page, {
      menuItems: MENU.map((item) => {
        return {
          active: currentPath == item.link,
          name: item.name,
          link: item.link,
        };
      }),
      image: activeImageIndex,
    });
  }
}

async function screening(response, page) {
  const parts = page.split('?');
  const queryString = parts.slice(1).join('?');

  fetch(`${screeningUrl}${queryString}`, settingsGet)
    .then((response) => response.json())
    .then((json) => {
      return(page, {
        screenings: json.data.map((screenings) => {
          console.log(screenings);
          /*return {
            id: screenings.attributes.movie.data.id,
            title: screenings.attributes.movie.attributes.title,
            image: screenings.attributes.movie.attributes.image.url,
            image: screenings.attributes.movie.attributes.image.url,
          };*/
        }),
      });
    });
}

app.get('/', async (request, response) => {
  renderPage(response, 'index');
});

app.get('/about', async (request, response) => {
  renderPage(response, 'about');
});

app.get('/contact', async (request, response) => {
  renderPage(response, 'contact');
});

app.get('/movies', async (request, response) => {
  renderPage(response, 'movies');
});

app.get('/movie/:id', async function (request, response) {
  const id = request.params.id;
  renderPage(response, `/movie/${id}`);
});

app.get('/app/home/screenings', async (request, response) => {
  const queryString = request.query;
  screening(response, `/app/screenings${queryString}`);
});

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', async function (request, response) {
  response.status(404);
  renderPage(response, '404');
});

export default app;
