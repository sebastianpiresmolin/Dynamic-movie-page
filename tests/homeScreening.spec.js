import { jest } from '@jest/globals';
import homeScreening from '../src/homeScreening.js';

test('Only show screenings for the next five days', async () => {
  const mockedDate = new Date('2024-02-02T13:37:00.000Z');
  jest.setSystemTime(mockedDate);
  const getTenScreeningsAdapter = {
    loadAllMovieScreenings: async () => [
      mockTime({ start_time: '2024-02-02T19:00:00.000Z' }),
      mockTime({ start_time: '2024-02-03T19:00:00.000Z' }),
      mockTime({ start_time: '2024-02-10T19:00:00.000Z' }),
    ],
  };

  const data = await homeScreening(getTenScreeningsAdapter, mockedDate);
  expect(data).toHaveLength(2);
});

test('Only show max 10 screenings', async () => {
  const mockedDate = new Date('2024-02-02T13:37:00.000Z');
  jest.setSystemTime(mockedDate);
  const getTenScreeningsAdapter = {
    loadAllMovieScreenings: async () => [
      mockTime({ start_time: '2024-02-02T19:00:00.000Z' }),
      mockTime({ start_time: '2024-02-03T19:00:00.000Z' }),
      mockTime({ start_time: '2024-02-02T19:00:00.000Z' }),
      mockTime({ start_time: '2024-02-03T19:00:00.000Z' }),
      mockTime({ start_time: '2024-02-02T19:00:00.000Z' }),
      mockTime({ start_time: '2024-02-03T19:00:00.000Z' }),
      mockTime({ start_time: '2024-02-02T19:00:00.000Z' }),
      mockTime({ start_time: '2024-02-03T19:00:00.000Z' }),
      mockTime({ start_time: '2024-02-02T19:00:00.000Z' }),
      mockTime({ start_time: '2024-02-03T19:00:00.000Z' }),
      mockTime({ start_time: '2024-02-02T19:00:00.000Z' }),
      mockTime({ start_time: '2024-02-03T19:00:00.000Z' }),
      mockTime({ start_time: '2024-02-10T19:00:00.000Z' }),
    ],
  };

  const data = await homeScreening(getTenScreeningsAdapter, mockedDate);
  expect(data).toHaveLength(10);
});

function mockTime(attributes) {
  return {
    id: 201,
    attributes: {
      start_time: attributes.start_time,
      room: 'Stora salongen',
      createdAt: '2023-05-25T13:09:53.589Z',
      updatedAt: '2023-05-25T13:09:53.589Z',
      movie: {
        data: {
          id: 4,
          attributes: {
            title: 'Min granne Totoro',
            imdbId: 'tt0096283',
            intro:
              'When two girls move to the country to be near their ailing mother, they have **adventures with the wondrous forest spirits** who live nearby.',
            image: {
              url: 'https://m.media-amazon.com/images/M/MV5BYzJjMTYyMjQtZDI0My00ZjE2LTkyNGYtOTllNGQxNDMyZjE0XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg',
            },
            createdAt: '2023-01-23T09:15:23.153Z',
            updatedAt: '2023-01-27T07:12:08.242Z',
            publishedAt: '2023-01-23T09:15:43.382Z',
          },
        },
      },
    },
  };
}
