import { expect, test } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import fetch from 'node-fetch';

const url = 'https://plankton-app-xhkom.ondigitalocean.app/api/movies';
const settings = { method: 'Get' };

let APImapped;

beforeAll(async () => {
  const response = await fetch(url, settings);
  const json = await response.json();

  let APIdata = json;
  APImapped = APIdata.data.map((movies) => {
    return {
      id: movies.id,
      title: movies.attributes.title,
      intro: movies.attributes.intro,
      image: movies.attributes.image.url,
    };
  });
});

test(`page shows title of movie`, async () => {
  for (let i = 0; i < APImapped.length; i++) {
    const response = await request(app)
      .get(`/movie/${APImapped[i].id}`)
      .expect(200);

    expect(response.text).toMatch(`${APImapped[i].title}`);
  }
}, 10000);
