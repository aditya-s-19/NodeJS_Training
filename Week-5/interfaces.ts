import { Document } from 'mongoose';

export interface SportShape {
  name: string;
  minimumNoOfPlayers: number;
  maximumNoOfPlayers: number;
  playerSample: PlayerData;
}

export interface AggregateData {
  minimumNoOfPlayers: number;
  totalSports: number;
  sportNames: string[];
}

export interface PlayerData {
  name: string;
  sport: string;
}

export interface SportDocument extends SportShape, Document {}

export interface PlayerDocument extends PlayerData, Document {}

export interface User {
  name: string;
}
