require("dotenv").config();
const express=require("express");
const cors=require("cors");
const mongoose=require("mongoose");
const app=express();
app.use(cors());
app.use(express.json())

const Todos = require("./TodoModel")

app.use("/postTodo", async (req, res) => {
  const { text, date } = req.body;
  await Todos.create({
    text,
    date
  })
  console.log(text)
  let data = await Todos.find({})
  res.json({ data: data })
})

app.use("/getTodo", async (req, res) => {
  const month=req.query.month;
  let data = await Todos.find({})
  data = data.filter((ele) => {
    return ele.date.getMonth()+1==month
  })
  // console.log(tmpData)
  res.json({ data: data });
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
    console.log("connected to 5000")
})