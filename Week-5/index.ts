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

app.get('/token', (req: Request, res: Response) => {
  const user: User = req.body.user;
  const token: string = generateJWT(user);
  res.status(200).send(token);
});

app.get(
  '/sports',
  authenticateJWT,
  async (req: Request, res: Response): Promise<void> => {
    const data: SportShape[] | AggregateData[] =
      req.query.type !== 'aggregate'
        ? await getData()
        : await getDataAggregation();
    if (data) {
      res.status(202).send(data).end();
    } else {
      res.status(404).send('No Data found').end();
    }
    return;
  },
);

app.post(
  '/sports',
  authenticateJWT,
  async (req: Request, res: Response): Promise<void> => {
    const newSport: SportShape = req.body.newSport;
    const status = await enterData(newSport);
    status !== 400
      ? res.status(status).send('Data submitted')
      : res.status(status).send('Some Problem Occured');
    return;
  },
);

app.listen(3000, () => console.log('Server listening on port 3000'));
