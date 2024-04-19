const express = require("express");
const multer = require("multer");
const path = require("path");
import { Express } from "express-serve-static-core";
import { Request, Response } from "express";

interface File {
  originalname: string;
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req: Request, file: File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, "Images");
  },
  filename: (req: Request, file: File, cb: (error: Error | null, filename: string) => void) => {
    const fileName = path.parse(file.originalname).name;
    const extension = path.extname(file.originalname);
    cb(null, `${fileName}-${Date.now() + extension}`);
  },
});

const upload = multer({ storage: storage });

app.post("/profile", upload.single("image"), (req: Request, res: Response): void => {
  res.status(200).send("File uploaded successfully");
});

app.listen(3000, () => console.log("Server started at port 3000"));
