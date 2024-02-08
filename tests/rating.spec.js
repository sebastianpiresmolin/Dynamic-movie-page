import fetch from 'node-fetch';

async function fetchMovieTitlesFromYourAPI() {
    try {
        const response = await fetch('https://plankton-app-xhkom.ondigitalocean.app/api/movies');
        const data = await response.json();
        
        const movieTitles = data.data.map(movie => movie.attributes.title);

        return movieTitles;
    } catch (error) {
        console.error('Error fetching movie titles from your API:', error);
        return [];
    }
}

async function fetchMovieDataFromOMDB(movieTitle) {
    const response = await fetch(`http://www.omdbapi.com/?t=${encodeURIComponent(movieTitle)}&apikey=eb137354`);
    const data = await response.json();
    return data;
}

describe('OMDB API Test Suite', () => {
    test('Fetch and test movie ratings from your API', async () => {
        const movieTitles = await fetchMovieTitlesFromYourAPI();

        for (const movieTitle of movieTitles) {
            const movieData = await fetchMovieDataFromOMDB(movieTitle);

            console.log(`Movie Data for "${movieTitle}":`, movieData);

            if (movieData.Response === 'False') {
                console.log(`Skipping expectations for "${movieTitle}" because it was not found on IMDb.`);
                continue;
            }

            expect(movieData.Ratings).toBeDefined();
            expect(Array.isArray(movieData.Ratings)).toBe(true);
            expect(movieData.Ratings.length).toBeGreaterThan(0);
            expect(movieData.Ratings[0].Source).toBeDefined();
            
            if (typeof movieData.imdbRating !== 'undefined') {
                expect(movieData.Ratings[0].Value).toBeDefined();
            } else {
                console.log(`Skipping IMDb rating expectations for "${movieTitle}" because it doesn't have an IMDb score.`);
            }
        }
    });
});
