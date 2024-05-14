const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_ORIGIN, // frontend origin
    methods: ["GET", "POST"], // HTTP methods to allow
    credentials: true, // to allow cookies
  },
});

io.on("connection", (socket) => {
  console.log("socket connected");
  socket.on("sendMessage", (receiverId) => {
    io.emit("receiveMessage", receiverId);
  });

  socket.on("disconnect", () => {
    console.log("socket disconnected");
  });
});

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
const { log } = require("console");

app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/users", usersRoute);
app.use("/messages", messagesRoute);

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});
