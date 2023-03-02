require("dotenv").config();
const express=require("express");
const cors=require("cors");
const mongoose=require("mongoose");
const app=express();
app.use(cors());

app.use("/", (req, res) => {
    res.send("Hello")
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