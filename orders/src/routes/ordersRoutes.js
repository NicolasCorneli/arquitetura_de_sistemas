const express = require("express");
const {
  createOrder, getOrders, getOrderById, updateOrderStatus,
} = require("../controllers/ordersController");

const router = express.Router();
router.post("/", createOrder);
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.patch("/:id/status", updateOrderStatus);

module.exports = router;
