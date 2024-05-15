const { enterData, getData, getDataAggregation, Sport } = require('../mongo');
describe('enterData', () => {
  it('should return 201 on successful data entry', async () => {
    Sport.save = jest.fn().mockResolvedValue(9);
    const result = await enterData({
      name: 'Badminton',
      minimumNoOfPlayers: 2,
      maximumNoOfPlayers: 4,
    });
    expect(result).toBe(201);
  });

  it('should return 400 on error during data entry', async () => {
    Sport.save = jest.fn().mockImplementation(() => {
      throw new Error('Mock Error');
    });
    const result = await enterData({
      name: 'Badminton',
      minimumNoOfPlayers: 2,
      maximumNoOfPlayers: 4,
    });
    expect(result).toBe(400);
  });
});

describe('getData', () => {
  it('should return array of SportShape objects', async () => {
    Sport.find = jest.fn().mockResolvedValue([
      {
        name: 'Badminton',
        minimumNoOfPlayers: 2,
        maximumNoOfPlayers: 4,
      },
      {
        name: 'Tennis',
        minimumNoOfPlayers: 2,
        maximumNoOfPlayers: 4,
      },
      {
        name: 'Table-Tennis',
        minimumNoOfPlayers: 2,
        maximumNoOfPlayers: 4,
      },
      {
        name: 'Cricket',
        minimumNoOfPlayers: 22,
        maximumNoOfPlayers: 22,
      },
      {
        name: 'Foosball',
        minimumNoOfPlayers: 2,
        maximumNoOfPlayers: 4,
      },
      {
        name: 'Volleyball',
        minimumNoOfPlayers: 12,
        maximumNoOfPlayers: 12,
      },
      {
        name: 'Chess',
        minimumNoOfPlayers: 2,
        maximumNoOfPlayers: 2,
      },
    ]);
    const result = await getData();
    expect(result).toEqual([
      {
        name: 'Cricket',
        minimumNoOfPlayers: 22,
        maximumNoOfPlayers: 22,
      },
      {
        name: 'Volleyball',
        minimumNoOfPlayers: 12,
        maximumNoOfPlayers: 12,
      },
      {
        name: 'Badminton',
        minimumNoOfPlayers: 2,
        maximumNoOfPlayers: 4,
      },
      {
        name: 'Tennis',
        minimumNoOfPlayers: 2,
        maximumNoOfPlayers: 4,
      },
      {
        name: 'Table-Tennis',
        minimumNoOfPlayers: 2,
        maximumNoOfPlayers: 4,
      },
    ]);
  });

  it('should return empty array on error', async () => {
    Sport.find = jest.fn().mockImplementation(() => {
      throw new Error('Mock Error');
    });
    const result = await getData();
    expect(result).toEqual([]);
  });
});

describe('getDataAggregation', () => {
  it('should return array of AggregateData objects', async () => {
    Sport.aggregate = jest.fn().mockResolvedValue([
      {
        _id: 1,
        totalSports: 5,
        sportNames: ['Football', 'Basketball', 'Tennis'],
      },
    ]);
    const result = await getDataAggregation();
    expect(result).toEqual([
      {
        _id: 1,
        totalSports: 5,
        sportNames: ['Football', 'Basketball', 'Tennis'],
      },
    ]);
  });

  it('should return empty array on error', async () => {
    Sport.aggregate = jest.fn().mockImplementation(() => {
      throw new Error('Mock Error');
    });
    const result = await getDataAggregation();
    expect(result).toEqual([]);
  });
});
