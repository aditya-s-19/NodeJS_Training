const express = require("express");
import { Request, Response } from "express";
import { Task } from "../../interfaces/todo";

const app = express();
let tasks: Task[] = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response): void => {
  console.log("hello");
  res.send(JSON.stringify(tasks));
});

app.post("/", (req: Request, res: Response): void => {
  const newTask: Task = {
    id: `task #${Date.now()}`,
    value: req.body.value,
    date: req.body.date,
    isCompleted: false,
  };
  tasks.push(newTask);
  res.send(JSON.stringify(tasks));
});

app.put("/", async (req: Request, res: Response): void => {
  tasks = [req.body.newTasks];
  res.send(JSON.stringify(tasks));
});

app.patch("/", (req: Request, res: Response): void => {
  const updatedTask: Task = req.body.task;
  tasks = tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task));
  res.send(JSON.stringify(tasks));
});

app.delete("/", (req: Request, res: Response): void => {
  const deletedId: string = req.body.id;
  tasks = tasks.filter((task) => task.id !== deletedId);
  res.send(JSON.stringify(tasks));
});

app.listen(4000);
