const express = require("express");
const { sendNotification } = require("./notificationController");

const router = express.Router();

router.post("/", sendNotification);

module.exports = router;
