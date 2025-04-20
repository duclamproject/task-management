const express = require("express");
const database = require("./config/database");
const env = require("dotenv").config();
const app = express();
const port = process.env.PORT;

database.connect();

const Task = require("./models/task.model");

app.get("/task", async (req, res) => {
  const tasks = await Task.find({ deleted: false });
  console.log(tasks);

  res.json(tasks);
});

app.get("/task/detail/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findOne({ _id: id, deleted: false });
    console.log(task);

    res.json(task);
  } catch (error) {
    res.json("Không tìm thấy");
  }
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
