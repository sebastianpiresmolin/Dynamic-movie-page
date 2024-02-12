document.addEventListener("DOMContentLoaded", async function () {
    const currentPath = window.location.pathname;
    let page = 1;
    let movieId;

    // Find the buttons in the template
    const nextBtn = document.querySelector('.reviews__next');
    const prevBtn = document.querySelector('.reviews__prev');
    const reviewsTemplate = document.querySelector('.reviewsTemplate');
    const pageNumberDisplay = document.querySelector('.page-number');

    if (!prevBtn || !nextBtn || !reviewsTemplate) {
        console.error('Elements with class "reviews__prev", "reviews__next", or "reviewsTemplate" is not found.');
        return;
    }

    prevBtn.style.display = 'none';

    // Get the movieId from wherever it's stored in your application
    movieId = currentPath.split("/").pop();

    await handleReviewRendering();

    /* Listener for the next btn */
    nextBtn.addEventListener('click', nextPage);

    /* Listener for the prev btn */
    prevBtn.addEventListener('click', prevPage);

    function updatePageNumber() {
        if (pageNumberDisplay) {
            pageNumberDisplay.textContent = `Page: ${page}`;
        }
    }

    async function nextPage() {
        disableBtn(nextBtn);
        prevBtn.style.display = 'block';
        page++;
        await handleReviewRendering();
        updatePageNumber();
    }

    async function prevPage() {
        disableBtn(prevBtn);
        page--;
        await handleReviewRendering();
        updatePageNumber();
    }

    async function handleReviewRendering() {
        const reviewsBox = document.querySelector('.reviews');
        if (!reviewsBox) {
            console.error('Element with class "reviews" not found.');
            return;
        }

        while (reviewsBox.firstElementChild) {
            reviewsBox.removeChild(reviewsBox.lastElementChild);
        }

        // Pass the movieId to renderReview
        await renderReview(await fetchReviews(currentPath, page), movieId);

        // Check whether to display or hide the prevBtn
        if (page === 1) {
            prevBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'block';
        }

        // Check whether to display or hide the nextBtn based on the presence of reviews
        const nextReviews = await fetchReviews(currentPath, page + 1);
        if (nextReviews.data.length < 1) {
            nextBtn.style.display = 'none';
            nextBtn.removeEventListener('click', nextPage); // Remove click event listener when there are no more reviews
        } else {
            nextBtn.style.display = 'block';
            nextBtn.addEventListener('click', nextPage); // Add back click event listener when there are reviews
        }
    }

    async function fetchReviews(path, page) {
        const response = await fetch(`https://plankton-app-xhkom.ondigitalocean.app/api/reviews?filters[movie]=${movieId}&pagination[page]=${page}&pagination[pageSize]=5`);
        if (response.ok) {
            let payload = await response.json();
            console.log('Fetched Reviews:', payload);
            return payload;
        } else {
            throw new Error(`Something went wrong with the request. Error code: ${response.status}`);
        }
    }

    async function renderReview(reviewsArr, movieId) {
        console.log('Rendering reviews for movie:', movieId);

        const reviewsList = document.querySelector('.reviews');

        // Render each review
        for (const obj of reviewsArr.data) {

            // Check if 'attributes' property exists
            const attributes = obj.attributes || {};

            // Use 'attributes.author' if available, otherwise, use 'obj.author'
            const author = attributes.author !== null ? `Author: ${attributes.author}` || 'Anonymous' : 'Anonymous';

            // Use 'attributes.comment' if available, otherwise, use an empty string
            const comment = attributes.comment !== null ? `Comment: ${attributes.comment}` || '' : '';

            // Use 'attributes.rating' if available, otherwise, set it to null
            const rating = attributes.rating !== null ? `Ratings: ${attributes.rating}` : 'Ratings: Not Available';

            // Create a new review element
            const reviewItem = document.createElement('li');
            reviewItem.classList.add('review');

            const reviewComment = document.createElement('p');
            reviewComment.classList.add('reviewComment');
            reviewComment.textContent = comment;

            const reviewAuthor = document.createElement('p');
            reviewAuthor.classList.add('reviewAuthor');
            reviewAuthor.textContent = author;

            const reviewRating = document.createElement('span');
            reviewRating.classList.add('reviewRating');
            reviewRating.textContent = rating;

            // Append review elements to the reviews item
            reviewItem.appendChild(reviewComment);
            reviewItem.appendChild(reviewAuthor);
            reviewItem.appendChild(reviewRating);

            // Append the review item to the reviews list
            reviewsList.appendChild(reviewItem);
        }
    }

    function disableBtn(btn) {
        btn.disabled = true;
        setTimeout(() => btn.disabled = false, 250);
    }
});
