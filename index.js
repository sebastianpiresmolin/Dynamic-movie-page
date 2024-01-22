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



/*async function renderPage(response, page) {
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
}*/

app.get('/', async (request, response) => {
  renderPage(response, 'index');
});

app.get('/about', async (request, response) => {
  renderPage(response, 'about');
});

app.get('/contact', async (request, response) => {
  renderPage(response, 'contact');
});

app.get('');

app.use(express.static('static'));

app.listen(5080);
