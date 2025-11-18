const express = require("express");
const { 
  getAllUsers, 
  getUserById, 
  createUser 
} = require("../controllers/usersController");

const router = express.Router();

// Routes
router.get("/", getAllUsers);     // GET all
router.get("/:id", getUserById);  // GET by id
router.post("/", createUser);     // POST new

module.exports = router;
