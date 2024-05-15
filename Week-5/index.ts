const express = require('express');
import { Request, Response } from 'express';
import { AggregateData, SportShape } from './interfaces';
import {
  connectToDatabase,
  enterData,
  getData,
  getDataAggregation,
} from './mongo';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
connectToDatabase();

app.get('/sports', async (req: Request, res: Response): Promise<void> => {
  const data: SportShape[] | AggregateData[] =
    req.query.type !== 'aggregate'
      ? await getData()
      : await getDataAggregation();
  data ? res.status(200).json(data) : res.status(404).send('No Data found');
  return;
});

app.post('/sports', async (req: Request, res: Response): Promise<void> => {
  const newSport: SportShape = req.body.newSport;
  const status = await enterData(newSport);
  status !== 400
    ? res.status(status).send('Data submitted')
    : res.status(status).send('Some Problem Occured');
  return;
});

app.listen(3000, () => console.log('Server listening on port 3000'));
