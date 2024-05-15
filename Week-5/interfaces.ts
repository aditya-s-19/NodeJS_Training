import { Document } from 'mongoose';

export interface SportShape {
  name: string;
  minimumNoOfPlayers: number;
  maximumNoOfPlayers: number;
}

export interface AggregateData {
  minimumNoOfPlayers: number;
  totalSports: number;
  sportNames: string[];
}

export interface SportDocument extends SportShape, Document {}
