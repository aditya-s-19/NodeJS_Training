const express = require("express");
import { User, DatabaseOperationResult } from "./interfaces";
import { Request, Response } from "express";
import { createUser, readUser, updateUser, deleteUser } from "./firebase";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const writeToDatabase = async (
  user: User,
  res: Response,
  databaseOperation: (user: User) => Promise<DatabaseOperationResult>
) => {
  if (!user) {
    res.status(404).send("User data not sent").end();
    return;
  }
  const result: DatabaseOperationResult = await databaseOperation(user);
  res.status(result.status).send(result.message).end();
  return;
};

app.get("/", async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName } = req.query;
  if (typeof firstName !== "string" || typeof lastName !== "string") {
    res.status(400).send("Given user is invalid").end();
    return;
  }
  console.log("get request processing 2");
  try {
    const result: DatabaseOperationResult = await readUser({
      firstName,
      lastName,
    });
    if (result.userData) {
      res.json(result.userData).status(result.status).end();
    }
    console.log("get request processing 4");
  } catch (err) {
    console.log("get request processing 5");
    console.log("Error Occurred: " + err);
    res.status(500).send("Internal Server Error").end();
  }
  res.end();
});

app.post("/", async (req: Request, res: Response): Promise<void> => {
  writeToDatabase(req.body.user, res, createUser);
});

app.patch("/", async (req: Request, res: Response): Promise<void> => {
  writeToDatabase(req.body.user, res, updateUser);
});

app.delete("/", async (req: Request, res: Response): Promise<void> => {
  writeToDatabase(req.body.user, res, deleteUser);
});

app.listen(4000, () => console.log("Server running on port 4000"));
