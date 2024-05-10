const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
app.use(express.json());

const Article = require("./models/atricle");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("success");
  })
  .catch((err) => {
    console.log("error : ");
  });

app.post("/create-article", async (req, res) => {
  try {
    const { name, title, age } = req.body;
    const newArticle = await Article.create({ name, title, age });
    res
      .status(201)
      .json({ message: "Successfully stored data", data: newArticle });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error storing data", error: error.message });
  }
});

app.get("/all-articles", async (req, res) => {
  const articles = await Article.find();
  res.json(articles);
});

app.get("/all-articles/:articleID", async (req, res) => {
  const id = req.params.articleID;
  try {
    const articles = await Article.findById(id);
    res.json(articles);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

app.delete("/all-articles/:articleID", async (req, res) => {
  const id = req.params.articleID;
  try {
    await Article.findByIdAndDelete(id);
    res.send("delete success");
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

app.listen(3000, () => {
  console.log("I am listening to PORT 3000");
});
