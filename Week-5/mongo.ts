const mongoose = require('mongoose');
import { Model, Schema } from 'mongoose';
import { AggregateData, SportShape, SportDocument } from './interfaces';

const dbUri = 'mongodb://localhost:27017/players';
const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(dbUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

const sportSchema: Schema = new mongoose.Schema(
  {
    name: String,
    minimumNoOfPlayers: Number,
    maximumNoOfPlayers: Number,
  },
  {
    collection: 'sports',
  },
);

sportSchema.index({ name: 1 });

const Sport: Model<SportDocument> = mongoose.model('Sport', sportSchema);

const enterData = async (sportData: SportShape): Promise<number> => {
  try {
    const data = new Sport(sportData);
    console.log('Starting saving');
    await data.save();
    console.log('Sport data saved successfully');
    return 201;
  } catch (err) {
    console.log('Error saving sport data:', err);
    return 400;
  }
};

const getData = async (): Promise<SportShape[]> => {
  try {
    console.log('Starting getting');

    const data: SportShape[] = await Sport.find()
      .sort({ maximumNoOfPlayers: -1 })
      .limit(5);
    console.log('Done getting');

    return data;
  } catch (err) {
    console.log('Error saving sport data:', err);
    return [];
  }
};

const getDataAggregation = async (): Promise<AggregateData[]> => {
  try {
    const data: AggregateData[] = await Sport.aggregate([
      {
        $group: {
          _id: '$minimumNoOfPlayers',
          totalSports: { $count: {} },
          sportNames: { $push: '$name' },
        },
      },
    ]);
    return data;
  } catch (err) {
    console.log('Error saving sport data:', err);
    return [];
  }
};

export {
  Sport,
  sportSchema,
  enterData,
  getData,
  getDataAggregation,
  connectToDatabase,
};
