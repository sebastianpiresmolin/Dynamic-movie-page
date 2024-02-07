import express from 'express';
import { engine } from 'express-handlebars';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const url = 'https://plankton-app-xhkom.ondigitalocean.app/api/movies';
const omdbApiKey = process.env.OMDB_API_KEY;
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
        }
        return response.json();
      })
      .then((json) => {
        if (!json.data) {
          throw new Error('No data found');
        }
        response.render('movie', {

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

app.post("/movies/:movieId/review", (request, response) => {
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
  const fetchUrl = "https://plankton-app-xhkom.ondigitalocean.app/api/reviews";
  fetch(fetchUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: jsonData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to write data to database");
      }
      return response.json();
    })
    .then((data) => {
      // console.log("Data written to database:", data);
      response.status(201).send("Data written to database");
    })
    .catch((error) => {
      console.error("Error writing to database:", error.message);
      response.status(500).send("Error writing to database");
    });
});

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
  renderPage(response, 'movies', true);
});

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

app.use(express.static('static'));

app.get('*', async function (request, response) {
  response.status(404);
  renderPage(response, '404');
});

export default app;
