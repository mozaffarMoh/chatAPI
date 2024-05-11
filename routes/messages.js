const express = require("express");
const MessageBox = require("../models/MessageBox");
const authenticateToken = require("../middleware/isAuth");

/* Get all Messages */
async function getAllMessages(req, res) {
  const senderID = req.params.senderID;
  const receiverID = req.params.receiverID;

  try {
    const messages = await MessageBox.find({
      $or: [
        { sender: senderID, receiver: receiverID },
        {
          sender: receiverID,
          receiver: senderID,
        },
      ],
    });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/* Send message */
async function sendMessage(req, res) {
  const { message, sender, receiver, timestamp } = req.body;
  try {
    const newMessage = new MessageBox({
      message,
      sender,
      receiver,
      timestamp,
    });
    await newMessage.save();
    res.send("Message send success");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const router = express.Router();

router.post("/send-message", authenticateToken, sendMessage);
router.get("/:senderID/:receiverID", authenticateToken, getAllMessages);

module.exports = router;
