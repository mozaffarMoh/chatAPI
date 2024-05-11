const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("success DB");
  })
  .catch((err) => {
    console.log("error DB ");
  });

const registerRoute = require("./routes/register");
const loginRoute = require("./routes/login");
const usersRoute = require("./routes/users");
const messagesRoute = require("./routes/messages");

app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/users", usersRoute);
app.use("/messages", messagesRoute);

app.listen(3000, () => {
  console.log("I am listening to PORT 3000");
});
