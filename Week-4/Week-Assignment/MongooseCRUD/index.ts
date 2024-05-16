require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
import { Request, Response } from "express";
import { Model } from "mongoose";

const app = express();
const isLocalDatabase = false;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

try {
  const connectDB = async (): Promise<void> => {
    await mongoose.connect(isLocalDatabase ? process.env.LOCAL_DB : process.env.CLOUD_DB);
  };
  connectDB();
} catch (err) {
  console.log(err);
}

const playerSchema = new mongoose.Schema(
  {
    name: String,
    sport: String,
  },
  { collection: "players" }
);
let PlayerModel: Model<typeof playerSchema>;
PlayerModel = new mongoose.model("PlayerModel", playerSchema);

const readData = async (name: string, res: Response) => {
  const result = name && PlayerModel ? await PlayerModel.find({ name }) : await PlayerModel.find();
  res.status(200).json(result);
  return result;
};

app.get("/players", async (req: Request, res: Response): Promise<void> => {
  try {
    if (!PlayerModel) {
      throw new Error("PlayerModel is undefined");
    }
    const name = req.query.name;
    if (name !== "string") {
      res.status(400).send("Bad Request. name not sent");
      return;
    } else {
      const result = await readData(name, res);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/players", async (req: Request, res: Response): Promise<void> => {
  try {
    if (!PlayerModel) {
      throw new Error("PlayerModel is undefined");
    }
    const { newRecord } = req.body;
    if (!newRecord) {
      res.status(400).send("Bad Request. newRecord not sent");
    }
    const findRecord = await PlayerModel.find(newRecord);
    if (!findRecord.length) {
      const result = await PlayerModel.create(newRecord);
      if ([result].length) {
        res.status(201).send(`Record created`);
      } else {
        res.status(404).send("No record created");
      }
    } else {
      res.status(409).send("Conflict: Duplicate records");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});
app.patch("/players", async (req: Request, res: Response): Promise<void> => {
  try {
    if (!PlayerModel) {
      throw new Error("PlayerModel is undefined");
    }
    const { oldRecord, updatedRecord } = req.body;
    if (!(oldRecord && updatedRecord)) {
      res.status(400).send("Bad Request. Records not sent");
    }
    const result = await PlayerModel.updateOne(oldRecord, updatedRecord);
    result.modifiedCount ? res.status(200).send("Record updated") : res.status(404).send("Record Not Found");

    res.status(200).send("Records Updated");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});
app.delete("/players", async (req: Request, res: Response): Promise<void> => {
  try {
    if (!PlayerModel) {
      throw new Error("PlayerModel is undefined");
    }
    const { deleteRecord } = req.body;
    if (!deleteRecord) {
      res.status(400).send("Bad Request. deleteRecord not sent");
    }
    const result = await PlayerModel.deleteOne(deleteRecord);
    result.deletedCount ? res.status(200).send("Record deleted") : res.status(404).send("Record Not Found");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
