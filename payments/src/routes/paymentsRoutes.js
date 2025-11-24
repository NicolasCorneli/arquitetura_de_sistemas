const express = require("express");
const {
  createPayment,
  getAllPayments,
  getPaymentById,
  processPayment,
} = require("../controllers/paymentsController");

const router = express.Router();

router.post("/", createPayment);
router.get("/", getAllPayments);
router.get("/:id", getPaymentById);
router.patch("/:id/process", processPayment);

module.exports = router;
