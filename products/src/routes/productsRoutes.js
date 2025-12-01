const express = require("express");
const {
  createProduct, getAllProducts, getProductById,
  updateProduct, deleteProduct, updateProductStock,
} = require("../controllers/productsController");

const router = express.Router();
router.post("/", createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.patch("/:id/stock", updateProductStock);

module.exports = router;
