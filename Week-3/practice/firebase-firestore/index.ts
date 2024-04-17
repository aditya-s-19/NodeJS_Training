const firebase_admin = require("firebase-admin");
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const express = require("express");
require("dotenv").config();
import { Request, Response } from "express";
import { firebaseConfig } from "./firebase";

interface User {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const firebaseApp = firebase_admin.initializeApp({
  credential: firebase_admin.credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS),
});

const db = firebase_admin.firestore();

app.get("/", async (req: Request, res: Response) => {
  const user: User = req.body.user;
  const { firstName, lastName } = user;
  const docRef = db.collection("users").doc((firstName[0] + lastName).toLowerCase());
  const doc = await docRef.get();
  if (!doc.exists) {
    return res.status(404).send("Given user doesn't exist");
  }
  return res.json(doc);
});

app.post("/", async (req: Request, res: Response) => {
  const user: User = req.body.user;
  if (!(user.firstName && user.lastName)) {
    return res.status(400).send("Given data is incomplete");
  }
  try {
    const docRef = db.collection("users").doc(`${(user.firstName[0] + user.lastName).toLowerCase()}`);
    await docRef.set(user);
    return res.status(204);
  } catch (err) {
    console.log("Error occurred: " + err);
    res.status(500).send("Error occured");
  }
});

app.listen(3000, () => console.log("Server Running at port 3000"));
