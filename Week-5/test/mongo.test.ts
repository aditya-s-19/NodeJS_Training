import { SportShape } from '../interfaces';

const {
  enterData,
  getData,
  getDataAggregation,
  Sport,
  Players,
} = require('../mongo');

describe('enterData', () => {
  it('should return 201 on successful data entry', async () => {
    Sport.prototype.save = jest.fn().mockResolvedValue(0);
    Players.findOne = jest.fn().mockImplementation((player) => {
      return player.sport === '-'
        ? {
            _id: '0000000',
            name: 'No Player Found',
            sport: '-',
          }
        : {
            _id: '1111111',
            name: 'Jest Test',
            sport: 'testSport',
          };
    });
    const testData: SportShape = {
      name: 'testSport',
      minimumNoOfPlayers: 2,
      maximumNoOfPlayers: 4,
    };
    const result = await enterData(testData);
    expect(result).toBe(201);
  });

  it('should return 400 on error during data entry', async () => {
    Players.findOne = jest.fn().mockImplementation(() => {
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
    Sport.find = jest.fn().mockImplementation(() => {
      return {
        sort: jest.fn().mockImplementation(() => {
          return {
            limit: jest.fn().mockImplementation(() => {
              return {
                populate: jest.fn().mockResolvedValue([
                  {
                    _id: '66443148801d37248e7ebf8a',
                    __v: 0,
                    name: 'testSport',
                    minimumNoOfPlayers: 2,
                    maximumNoOfPlayers: 4,
                    playerSample: {
                      _id: '1111111',
                      name: 'Jest Test',
                      sport: 'testSport',
                    },
                  },
                ]),
              };
            }),
          };
        }),
      };
    });
    const result = await getData();
    expect(result).toEqual([
      {
        _id: '66443148801d37248e7ebf8a',
        __v: 0,
        name: 'testSport',
        minimumNoOfPlayers: 2,
        maximumNoOfPlayers: 4,
        playerSample: {
          _id: '1111111',
          name: 'Jest Test',
          sport: 'testSport',
        },
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
