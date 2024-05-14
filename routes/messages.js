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

/* Edit message */
async function editMessage(req, res) {
  const messageID = req.params.messageID;
  const { message, timestamp } = req.body;
  try {
    const updatedMessage = await MessageBox.findOneAndUpdate(
      { _id: messageID },
      { message: message, timestamp: timestamp },
      { new: true }
    );

    if (updatedMessage) {
      res.send("Update message success");
    } else {
      res.status(404).json({ error: "Message not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/* Delete message */
async function deleteMessage(req, res) {
  const messageID = req.params.messageID;
  try {
    const updatedMessage = await MessageBox.findOneAndDelete({
      _id: messageID,
    });

    if (updatedMessage) {
      res.send("Delete message success");
    } else {
      res.status(404).json({ error: "Message not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const router = express.Router();

router.get("/:senderID/:receiverID", authenticateToken, getAllMessages);
router.post("/send-message", authenticateToken, sendMessage);
router.put("/edit-message/:messageID", authenticateToken, editMessage);
router.delete("/delete-message/:messageID", authenticateToken, deleteMessage);

module.exports = router;
