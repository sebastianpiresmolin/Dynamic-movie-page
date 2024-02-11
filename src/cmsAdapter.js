const getTenScreeningsAdapter = {
  async loadAllMovieScreenings() {
    const response = await fetch(
      "https://plankton-app-xhkom.ondigitalocean.app/api/screenings?pagination%5Blimit%5D=1000&populate=movie"
    );
    const payload = await response.json();
    return payload.data;
  },
};

export { getTenScreeningsAdapter };

const cmsAdapter = {
  async loadScreenings(queryString) {
    const response = await fetch(
      `https://plankton-app-xhkom.ondigitalocean.app/api/screenings${queryString}`
    );
    const payload = await response.json();
    return payload.data;
  },
};

export { cmsAdapter };
