const cmsAdapter = {
  async loadAllScreenings() {
    const response = await fetch(
      'https://plankton-app-xhkom.ondigitalocean.app/api/screenings?populate=movie'
    );
    const payload = await response.json();
    console.log(payload);
    return payload.data;
  },
};

export default cmsAdapter;
