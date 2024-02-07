import { expect, test } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const url = 'https://plankton-app-xhkom.ondigitalocean.app/api/movies';
const reviewUrl = 'https://plankton-app-xhkom.ondigitalocean.app/api/reviews';
const omdbApiKey = process.env.OMDB_API_KEY;
const settings = { method: 'Get' };

let movies; // Define movies as a global variable

// Fetch movie data from the API
async function fetchMovies() {
    const response = await fetch(url, settings);
    const json = await response.json();
    return json.data;
}

// Fetch IMDb rating from OMDB API
async function fetchOmdbRating(title) {
    const omdbApiUrl = `https://www.omdbapi.com/?apikey=${omdbApiKey}&t=${encodeURIComponent(title)}`;
    const omdbApiResponse = await fetch(omdbApiUrl);
    const omdbJson = await omdbApiResponse.json();
    return omdbJson.imdbRating;
}

// Fetch review ratings for a specific movie
async function fetchReviewRatings(movieId) {
    const response = await fetch(`${reviewUrl}?filters[movie]=${movieId}`);
    const json = await response.json();
    return json.data.map(review => review.attributes.rating);
}

test.each(movies.map((movie) => [movie.attributes.title]))(
    "page displays correct IMDb rating and review rating for %s",
    async (title) => {
        try {
            const omdbRating = await fetchOmdbRating(title);
            const reviewRatings = await fetchReviewRatings(title);

            const responseFromApp = await request(app)
                .get(`/movie/${title}`)
                .expect(200);

            console.log(`HTML content for ${title}: ${responseFromApp.text}`);

            // Extract IMDb rating from the HTML content
            const matchResult = responseFromApp.text.match(/<p>IMDb Rating: ([\d.]+|N\/A)<\/p>/);
            const imdbRatingFromPage = matchResult && matchResult[1] ? matchResult[1] : null;

            // Check if the matchResult exists and has the correct rating
            if (omdbRating === "N/A") {
                expect(imdbRatingFromPage).toBe("N/A");
            } else {
                expect(imdbRatingFromPage).toBe(omdbRating);
            }

            // Extract review rating from the HTML content
            const reviewRatingFromPage = responseFromApp.text.match(/<p>Review Rating: ([\d.]+)<\/p>/)[1];

            // Calculate average review rating
            const averageReviewRating = reviewRatings.reduce((total, rating) => total + rating, 0) / reviewRatings.length;

            // Check if the review rating displayed on the page matches the average review rating
            expect(parseFloat(reviewRatingFromPage)).toBeCloseTo(averageReviewRating);
        } catch (error) {
            // Handle errors appropriately
            console.error(error.message);
            throw error;
        }
    }
);

// Fetch movies before running tests
beforeAll(async () => {
    movies = await fetchMovies();
});

export { }; // Ensure this file is treated as a module