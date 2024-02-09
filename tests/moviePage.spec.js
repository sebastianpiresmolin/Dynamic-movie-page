// Test moviePage function: Only show upcoming screenings

import { jest } from '@jest/globals';
import moviePage from '../src/moviePage.js';

// Mock the current date to a specific value
const mockedDate = new Date('2024-02-07T12:00:00Z');
jest.useFakeTimers('modern').setSystemTime(mockedDate.getTime());

const cmsAdapter = {
  async loadScreenings() {
    // Mock data: Past and future screenings
    const mockScreenings = [
      {
        id: 1,
        attributes: {
          start_time: '2024-02-06T12:00:00.000Z', // Past screening
        },
      },
      {
        id: 2,
        attributes: {
          start_time: '2024-02-08T15:00:00.000Z', // Future screening
        },
      },
      {
        id: 3,
        attributes: {
          start_time: '2024-02-10T19:00:00.000Z', // Future screening
        },
      },
    ];
    return mockScreenings;
  },
};

describe('moviePage', () => {
  test('Test moviePage function: Only show upcoming screenings', async () => {
    const response = {
      json: jest.fn(),
    };

    await moviePage(response, cmsAdapter);

    // Expected result: Only future screenings
    const expectedResult = {
      screenings: [
        {
          id: 2,
          time: '2024-02-08 15:00', // Future screening
        },
        {
          id: 3,
          time: '2024-02-10 19:00', // Future screening
        },
      ],
    };

    expect(response.json).toHaveBeenCalledWith(expectedResult);
  });
});
