const express = require("express");
import { Request, Response } from "express";
const fs = require("fs/promises");
import { User } from "../interfaces/users";

const FILE_PATH = "../public/users.json";

const getAllUsersName = async () => {
  const response = await fs.readFile(FILE_PATH);
  const data = JSON.parse(response);
  const usersNames = data.map((user: User) => `${user.given_name} ${user.family_name}`);
  return usersNames;
};

const app = express();

app.get("/", async (req: Request, res: Response) => {
  const users = await getAllUsersName();
  res.json(users);
});

app.listen(5000);
