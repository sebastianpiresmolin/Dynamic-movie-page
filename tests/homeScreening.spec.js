import { jest } from '@jest/globals';
import getTenScreenings from '../src/getTenScreenings.js';

test('Only show screenings for the next five days', async () => {
  const getTenScreeningsAdapter = {
    loadAllScreenings: async () => [
      mockTime({ start_time: '2024-02-02T19:00:00.000Z' }),
      mockTime({ start_time: '2024-02-03T19:00:00.000Z' }),
      mockTime({ start_time: '2024-02-10T19:00:00.000Z' }),
    ],
  };

  const data = await getTenScreenings(getTenScreeningsAdapter);
  expect(data).toHaveLength(2);
});

test('Only show screenings for the next five days', async () => {
  const getTenScreeningsAdapter = {
    loadAllScreenings: async () => [
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

  const data = await getTenScreenings(getTenScreeningsAdapter);
  expect(data).toHaveLength(10);
});

function mockTime(attributes) {
  return {
    id: 201,
    time: attributes.start_time,
    attributes: {
      room: 'Stora salongen',
      createdAt: '2023-05-25T13:09:53.589Z',
      updatedAt: '2023-05-25T13:09:53.589Z',
      movie: {
        data: {
          id: '1',
          attributes: { image: { url: 'url' }, title: 'title' },
        },
      },
    },
  };
}
