const express = require('express');
import { Request, Response } from 'express';
import { AggregateData, SportShape, User } from './interfaces';
import {
  connectToDatabase,
  enterData,
  getData,
  getDataAggregation,
} from './mongo';
import { authenticateJWT, generateJWT } from './jwt';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
connectToDatabase();

app.get('/token', (req: Request, res: Response): void => {
  try {
    const user: User = req.body.user;
    if (!user) {
      res.status(400).send('Bad Request');
      return;
    }
    const token: string = generateJWT(user);
    res.status(200).send(token);
  } catch (err) {
    console.log('Error occured: ', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get(
  '/sports',
  authenticateJWT,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const data: SportShape[] | AggregateData[] =
        req.query.type !== 'aggregate'
          ? await getData()
          : await getDataAggregation();
      data ? res.status(200).send(data) : res.status(404).send('No Data found');
    } catch (err) {
      console.log('Error occured: ', err);
      res.status(500).send('Internal Server Error');
    }
  },
);

app.post(
  '/sports',
  authenticateJWT,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const newSport: SportShape = req.body.newSport;
      if (!newSport) {
        res.status(400).send('Bad Request');
        return;
      }
      const status: number = await enterData(newSport);
      if (status !== 201) {
        throw new Error('Function enterData() crashed in mongo.ts');
      }
      res.status(status).send('Data submitted');
    } catch (err) {
      console.log('Error occured: ', err);
      res.status(500).send('Internal Server Error');
    }
  },
);

app.listen(3000, () => console.log('Server listening on port 3000'));
