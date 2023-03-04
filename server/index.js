require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
app.use(cors());
app.use(express.json());

const Todos = require("./TodoModel");

app.use("/postTodo", async (req, res) => {
  const { text, date, striked } = req.body;
  const index = await Todos.find({}).count();
  await Todos.create({
    text,
    date,
    striked,
    index
  });
  let data = await Todos.find({});
  res.json({ data: data });
});

app.use("/getTodo", async (req, res) => {
  const month = req.query.month;
  const year = req.query.year;
  let data = await Todos.find({}).sort({ "index": 1 });
  if (month && year) {
    data = data.filter((ele) => {
      if (ele.date.getMonth() + 1 == month && ele.date.getFullYear() == year)
        return true;
    });
  } else if (month) {
    data = data.filter((ele) => {
      if (ele.date.getMonth() + 1 == month) return true;
    });
  } else if (year) {
    data = data.filter((ele) => {
      if (ele.date.getFullYear() == year) return true;
    });
  }
  res.json({ data: data });
});

app.use("/getYear", async (req, res) => {
  let data = await Todos.aggregate([
    {
      $project: {
        year: { $year: "$date" },
      },
    },
    {
      $group: {
        _id: null,
        distinctYear: { $addToSet: "$year" },
      },
    },
  ]);
  res.json({ data });
});

app.use("/getMonth", async (req, res) => {
  let data = await Todos.aggregate([
    {
      $project: {
        month: { $month: "$date" },
      },
    },
    {
      $group: {
        _id: null,
        distinctMonth: { $addToSet: "$month" },
      },
    },
  ]);
  res.json({ data });
})

app.use("/updateTodo/:id", async (req, res) => {
  let id = req.params['id']
  const { date, striked, text, index } = req.body;
  console.log(index)
  let data = await Todos.findByIdAndUpdate(id, {
    date,
    striked,
    text,
    index
  }, {new: true})
  res.json({data})
})

app.use("/deleteTodo/:id", async (req, res) => {
  let id = req.params['id'];
  await Todos.findByIdAndDelete(id);
  res.json({ msg: "Deleted" })
})

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connected!!!");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(5000, (req, res) => {
  console.log("connected to 5000");
});
