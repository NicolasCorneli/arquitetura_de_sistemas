const prisma = require("../db/prisma");

async function getAllUsers(req, res) {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error fetching users" });
  }
}

async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Error fetching user" });
  }
}

async function createUser(req, res) {
  try {
    const { name, email } = req.body;
    const user = await prisma.user.create({
      data: { name, email },
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Error creating user" });
  }
}

module.exports = { 
  getAllUsers, 
  getUserById, 
  createUser 
};
