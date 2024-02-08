const cmsAdapter = {
  async loadScreenings(queryString) {
    const response = await fetch(
      `https://plankton-app-xhkom.ondigitalocean.app/api/screenings${queryString}`
    );
    const payload = await response.json();
    return payload.data;
  },
};

export default cmsAdapter;