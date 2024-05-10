const express = require("express");
const Users = require("../models/Users");
const authenticateToken = require("../middleware/isAuth");

/* Get all users */
async function getAllUsers(req, res) {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/* Get one user */
async function getOneUser(req, res) {
  const id = req.params.userID;
  try {
    const user = await Users.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/* Delete user */
async function deleteUser(req, res) {
  const id = req.params.userID;
  try {
    const deletedUser = await Users.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.send("delete success");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const router = express.Router();

router.get("/", authenticateToken, getAllUsers);
router.get("/:userID", authenticateToken, getOneUser);
router.delete("/:userID", authenticateToken, deleteUser);

module.exports = router;
