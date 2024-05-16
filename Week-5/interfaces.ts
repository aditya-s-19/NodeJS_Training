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

export interface PlayerData {
  name: string;
  sport: string;
}

export interface SportShapeWithRef extends SportShape {
  playerSample: PlayerData;
}

export interface SportDocument extends SportShape, Document {}

export interface PlayerDocument extends PlayerData, Document {}

export interface User {
  name: string;
}
