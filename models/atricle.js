const mongoose = require("mongoose");
const schema = mongoose.Schema;

const articleShcema = new schema({
  name: String,
  title: String,
  age: Number,
});

const article = mongoose.model("article", articleShcema);

module.exports = article;
