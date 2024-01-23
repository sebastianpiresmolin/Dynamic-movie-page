import express from 'express';
import { engine } from 'express-handlebars';
import fetch from 'node-fetch';

const url = 'https://plankton-app-xhkom.ondigitalocean.app/api/movies';
const settings = { method: 'Get' };

const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './templates');

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
  //Check to se if current page is index and also check which page is active so that I know which image to serve.
  const currentPath = page == 'index' ? '/' : `/${page}`;
  page === '/' ? 0 : page === 'about' ? 1 : page === 'contact' ? 2 : 0;

  if (page === 'movies') {
    fetch(url, settings)
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
    fetch(`${url}/${id}`, settings) // Fetch the data for the specific movie
      .then((response) => response.json())
      .then((json) => {
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

app.use(express.static('static'));

app.get('*', async function (request, response) {
  response.status(404);
  renderPage(response, '404');
});

app.listen(5080);
