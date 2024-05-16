const mongoose = require('mongoose');
import { Model, Schema } from 'mongoose';
import {
  AggregateData,
  SportShape,
  SportDocument,
  PlayerDocument,
} from './interfaces';

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
    playerExample: { type: Schema.Types.ObjectId, ref: 'Players' },
  },
  {
    collection: 'sports',
  },
);

const playerSchema: Schema = new mongoose.Schema(
  {
    name: String,
    sport: String,
  },
  {
    collection: 'players',
  },
);

sportSchema.index({ name: 1 });

const Sport: Model<SportDocument> = mongoose.model('Sport', sportSchema);
const Players: Model<PlayerDocument> = mongoose.model('Players', playerSchema);

const enterData = async (sportData: SportShape): Promise<number> => {
  try {
    const data = sportData;
    let samplePlayer = await Players.findOne({ sport: sportData.name });
    if (!samplePlayer) {
      samplePlayer = await Players.findOne({ sport: '-' });
    }
    const finalData = new Sport({ ...data, playerExample: samplePlayer!._id });
    await finalData.save();
    return 201;
  } catch (err) {
    console.log('Error saving sport data:', err);
    return 400;
  }
};

const getData = async (): Promise<SportShape[]> => {
  try {
    const data: SportDocument[] = await Sport.find()
      .sort({ maximumNoOfPlayers: -1 })
      .limit(5)
      .populate('playerExample');
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
