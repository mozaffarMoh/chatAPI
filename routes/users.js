const express = require("express");
const Users = require("../models/Users");
const authenticateToken = require("../middleware/isAuth");
const multer = require("multer");
const path = require("path");

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

/* Update Profile Photo */
async function updateProfilePhoto(req, res) {
  const userID = req.params.userID;
  const { profilePhoto } = req.body;
  try {
    const updatedPhoto = await Users.findOneAndUpdate(
      { _id: userID },
      { profilePhoto: profilePhoto },
      { new: true }
    );

    if (updatedPhoto) {
      res.send("Update Profile Photo success");
    } else {
      res.status(404).json({ error: "Photo not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/* Add new value to all users */
/* This function not for front its for me to add a new value if exist */
async function updateUsers(req, res) {
  try {
    const usersToUpdate = await Users.find({
      profilePhoto: { $exists: false },
    });

    for (const user of usersToUpdate) {
      user.profilePhoto = "";
      await user.save();
    }

    res.send("Users updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating users");
  }
}

const router = express.Router();

router.get("/", authenticateToken, getAllUsers);
router.get("/:userID", authenticateToken, getOneUser);
router.delete("/:userID", authenticateToken, deleteUser);
router.put("/profile-photo/:userID", authenticateToken, updateProfilePhoto);
router.get("/update-users/update", authenticateToken, updateUsers);

module.exports = router;
