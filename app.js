// Imports
import express from 'express';
import { engine } from 'express-handlebars';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const url = 'https://plankton-app-xhkom.ondigitalocean.app/api/movies';
const omdbApiKey = process.env.OMDB_API_KEY;
const settings = { method: 'Get' };

import homeScreening from './src/homeScreening.js';
import { getTenScreeningsAdapter } from './src/cmsAdapter.js';
import moviePage from './src/moviePage.js';
import { cmsAdapter } from './src/cmsAdapter.js';
//import renderPage from './renderPage.js';
import { builder } from './buildReviewBody.js';

// API URL's
export const movieUrl =
  'https://plankton-app-xhkom.ondigitalocean.app/api/movies';
export const APIurl = 'https://plankton-app-xhkom.ondigitalocean.app';

// fetch settings
export const settingsGet = { method: 'Get' };
export const settingsPost = { method: 'Post' };

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './templates');

app.use(express.static('static'));

// Navbar menu items
export const MENU = [
  { name: 'Home', link: '/' },
  { name: 'Movies', link: '/movies' },
  { name: 'About', link: '/about' },
  { name: 'Contact', link: '/contact' },
];

// Images for index, about and contact page
export const images = [
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

async function fetchReviews(movieId) {
  const reviewsResponse = await fetch(`https://plankton-app-xhkom.ondigitalocean.app/api/reviews?filters[movie]=${movieId}`);
  const reviewsJson = await reviewsResponse.json();
  return reviewsJson.data.map(review => review.attributes.rating); // Extract ratings from reviews
}

function calculateAverageRating(ratings) {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((total, rating) => total + rating, 0);
  return (sum / ratings.length).toFixed(1);
}

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
              imdbRating: movies.imdbRating,
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
    const id = page.split('/')[2];
    fetch(`${url}/${id}`, settings) 
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
          // Check if response was successful
          throw new Error('Network response was not ok'); // Throw an error if not
        }
        return response.json();
      })
      .then((json) => {
        if (!json.data) {
          throw new Error('No data found');
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

// REVIEW FORM - DONT REMOVE ----------------------------
app.post('/movies/:movieId/review', (request, response) => {
  const id = request.body.id;
  const comment = request.body.comment;
  const rating = request.body.rating;
  const author = request.body.author;

  const reviewAttributes = {
    movie: id,
    comment: comment,
    rating: rating,
    author: author,
    createdBy: author,
  };
  console.log(reviewAttributes);

  // Convert the JavaScript object to a JSON string
  const jsonData = JSON.stringify(builder(reviewAttributes));
  console.log(jsonData);
  const fetchUrl = 'https://plankton-app-xhkom.ondigitalocean.app/api/reviews';
  fetch(fetchUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: jsonData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to write data to database');
      }
      return response.json();
    })
    .then((data) => {
      // console.log("Data written to database:", data);
      response.status(201).send('Data written to database');
    })
    .catch((error) => {
      console.error('Error writing to database:', error.message);
      response.status(500).send('Error writing to database');
    });
});

app.get('/', async (request, response) => {
  renderPage(response, 'index');
});

// API route for about page
app.get('/about', async (request, response) => {
  renderPage(response, 'about');
});

// API route for contact page
app.get('/contact', async (request, response) => {
  renderPage(response, 'contact');
});

// API route for all movies page
app.get('/movies', async (request, response) => {
  renderPage(response, 'movies', true);
});

// API route for individual movie page
app.get('/movie/:id', async function (request, response) {
  const id = request.params.id;
  const currentPath = `/${id}`;
  
  fetch(`${url}/${id}`, settings)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(async (json) => {
      if (!json.data) {
        throw new Error('No data found');
      }
      const movie = json.data;
      const reviews = await fetchReviews(movie.id);
      const averageRating = calculateAverageRating(reviews);
      const omdbUrl = `https://www.omdbapi.com/?apikey=${omdbApiKey}&t=${encodeURIComponent(movie.attributes.title)}`;
      const omdbResponse = await fetch(omdbUrl);
      const omdbJson = await omdbResponse.json();
      const imdbRating = omdbJson.imdbRating || 'N/A';
      const displayImdbRating = reviews.length < 5;
      response.render('movie', {
        movie: {
          id: movie.id,
          title: movie.attributes.title,
          intro: movie.attributes.intro,
          image: movie.attributes.image.url,
          averageRating: displayImdbRating ? null : averageRating,
          imdbRating: displayImdbRating ? imdbRating : null,
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
      console.error('Fetch Error:', error);
      response.status(404);
      renderPage(response, '404');
    });
});
// function calculateAverageRating(reviews) {
//  const sum = reviews.reduce((total, review) => total + review.rating, 0);
//  return (sum / reviews.length).toFixed(1);
//}

// API route for index page screenings
app.get('/api/home/screenings', async (request, response) => {
  const screenings = await homeScreening(getTenScreeningsAdapter);
  response.json(screenings);
});

// API route for individual movie page screenings (client-side fetching)
app.get('/movie/:id/screenings', async (request, response) => {
  const movieId = request.params.id;
  const queryString = `?pagination%5Blimit%5D=100&filters[movie]=${movieId}`;
  moviePage(response, cmsAdapter, queryString);
});

app.get('/movies/:id/reviews/:page', async (req, res) => {
  const reviews = await getFiveReviews();
  res.json(reviews);
});


//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', async function (request, response) {
  response.status(404);
  renderPage(response, '404');
});
app.use(express.static('static'));

export default app;
