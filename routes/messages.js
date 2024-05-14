const express = require("express");
const MessageBox = require("../models/MessageBox");
const authenticateToken = require("../middleware/isAuth");

/* Get all Messages with Pagination */
async function getAllMessages(req, res) {
  const senderID = req.params.senderID;
  const receiverID = req.params.receiverID;
  const limit = parseInt(req.query.limit) || 10; // Default to 10 messages per page if not provided
  const lastID = req.query.lastID || null; // ID of the last message from the previous page

  try {
    // Base query to match sender and receiver
    let query = {
      $or: [
        { sender: senderID, receiver: receiverID },
        { sender: receiverID, receiver: senderID },
      ],
    };

    // If lastID is provided, add it to the query to get messages after this ID
    if (lastID) {
      query._id = { $lt: lastID };
    }

    const messages = await MessageBox.find(query)
      .sort({ _id: -1 }) // Sort by _id in descending order
      .limit(limit);

    const reversedMessages = messages.reverse();

    res.json(reversedMessages);
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
