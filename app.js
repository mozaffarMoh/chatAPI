const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://fff:fff@fff.ar7sepl.mongodb.net/?retryWrites=true&w=majority&appName=fff"
  )
  .then(() => {
    console.log("connect to MongoDB has been successful");
  })
  .catch((err) => {
    console.log("connect to MongoDB fail", err);
  });

app.get("/hello", (req, res) => {
  let name = req.body.name;
  let password = req.body.password;
  let role = req.query.role;
  let status = req.statusCode;
  //res.json([ { name, password, role }]);

  res.status(200).json({ status: 200, message: "Post success" });
});

app.get("/test", (req, res) => {
  res.send("success test");
});

app.listen(3000, () => {
  console.log("I am listening to PORT 3000");
});
