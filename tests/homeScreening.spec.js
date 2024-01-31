import { jest } from '@jest/globals';
import getTenScreenings from '../src/getTenScreenings.js';

test('Only show screenings for the next five days', async () => {
  const getTenScreeningsAdapter = {
    loadAllScreenings: async () => [
      [{ id: '1', attributes: { start_time: '2024-01-31T10:00:00.000Z' } }],
      [{ id: '2', attributes: { start_time: '2024-01-01T10:00:00.000Z' } }],
      [{ id: '3', attributes: { start_time: '2024-01-07T10:00:00.000Z' } }],
    ],
  };

  const data = await getTenScreenings(getTenScreeningsAdapter);
  console.log(data);
  expect(data.length).toBe(2);
});
