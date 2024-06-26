const express = require("express");
require("dotenv").config();
const jwt = require("jsonwebtoken");
import { Request, Response, NextFunction } from "express";
const fs = require("fs/promises");

const app = express();
const FILE_PATH: string = "../../resources/users.json";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/register", async (req: Request, res: Response): Promise<void> => {
  const { username, password, age } = req.body;
  const response = await fs.readFile(FILE_PATH);
  const data = JSON.parse(response);
  if (Object.keys(data).find((existingUsername) => existingUsername === username)) {
    return res.status(409).send("This username already exist");
  } else {
    data[username] = {
      password,
      age,
    };
    fs.writeFile(FILE_PATH, JSON.stringify(data));
    return res.status(201).send("User added successfully!");
  }
});

app.get("/login", async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  const response = await fs.readFile(FILE_PATH);
  const data = JSON.parse(response);

  if (!Object.keys(data).find((existingUsername) => existingUsername === username)) {
    return res.status(404).send("This username does not exist");
  }
  if (data[username].password !== password) {
    return res.status(401).send("This username and password combination does not exist");
  }
  const user = {
    username,
    age: data[username].age,
  };
  jwt.sign({ user }, process.env.SECRET_KEY, { expiresIn: "300s" }, (err: Error, token: string) => {
    if (err) {
      console.log(err);
    } else {
      return res.json({
        token,
      });
    }
  });
});

const getToken = (req: Request): string => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    return token;
  }
  return "";
};

const authorization = (req: Request, res: Response, next: NextFunction): void => {
  const token = getToken(req);
  if (!token) {
    return res.status(401).send("Error Occured while token authorization");
  }
  jwt.verify(token, process.env.SECRET_KEY, (err: Error, authData: string) => {
    if (err) {
      return res.status(498).send("Invalid/Expired token");
    }
    req.body.authData = authData;
    next();
  });
};

app.get("/:user", authorization, async (req: Request, res: Response): Promise<void> => {
  const response = await fs.readFile(FILE_PATH);
  const data = JSON.parse(response);
  if (!Object.keys(data).find((existingUsername) => existingUsername === req.params.user)) {
    return res.status(404).send("This username does not exist");
  }
  const currentUser = req.body.authData.user.username;
  return res.json({
    message: `Hello ${currentUser}`,
    password: `Age of ${req.params.user} is ${data[req.params.user].age}`,
  });
});

app.listen(3000, () => console.log("App running on port 3000"));
