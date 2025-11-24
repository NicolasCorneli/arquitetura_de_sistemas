const prisma = require("../db/prisma");

// POST /
async function createProduct(req, res) {
  try {
    const { name, price, stock } = req.body;

    // 🔹 Validações
    if (typeof price !== "number" || price < 0) {
      return res.status(400).json({ error: "Preço não pode ser negativo" });
    }
    if (typeof stock !== "number" || stock < 0) {
      return res.status(400).json({ error: "Stock não pode ser negativo" });
    }

    const p = await prisma.product.create({
      data: { name, price, stock },
    });
    res.status(201).json(p);
  } catch (e) {
    res.status(500).json({ error: "Error creating product", details: e.message });
  }
}

// GET /?cs=true
async function getAllProducts(req, res) {
  try {
    const { cs } = req.query;
    const products = cs
      ? await prisma.product.findMany({ where: { stock: { gt: 0 } } })
      : await prisma.product.findMany();
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: "Error fetching products", details: e.message });
  }
}

// GET /:id
async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const p = await prisma.product.findUnique({ where: { id: parseInt(id) } });
    if (!p) return res.status(404).json({ error: "Product not found" });
    res.json(p);
  } catch (e) {
    res.status(500).json({ error: "Error fetching product", details: e.message });
  }
}

// PATCH /:id
async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, price, stock } = req.body;

    // 🔹 Validações no update (apenas se os campos forem informados)
    if (typeof price !== "undefined" && price < 0) {
      return res.status(400).json({ error: "Preço não pode ser negativo" });
    }
    if (typeof stock !== "undefined" && stock < 0) {
      return res.status(400).json({ error: "Stock não pode ser negativo" });
    }

    const p = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { name, price, stock },
    });
    res.json(p);
  } catch (e) {
    res.status(500).json({ error: "Error updating product", details: e.message });
  }
}

// DELETE /:id
async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    await prisma.product.delete({ where: { id: parseInt(id) } });

    res.status(200).json({ message: `Produto '${product.name}' deletado com sucesso` });
  } catch (e) {
    res
      .status(500)
      .json({ error: "Erro ao deletar o produto", details: e.message });
  }
}

// PATCH /:id/stock  { stockDelta: number }
async function updateProductStock(req, res) {
  try {
    const { id } = req.params;
    const { stockDelta } = req.body;
    if (typeof stockDelta === "undefined") {
      return res.status(400).json({ error: "stockDelta is required" });
    }

    const current = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });
    if (!current) return res.status(404).json({ error: "Product not found" });

    const newStock = (current.stock || 0) + Number(stockDelta);
    if (newStock < 0) {
      return res.status(400).json({ error: "Insufficient stock" });
    }

    const p = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { stock: newStock },
    });
    res.json(p);
  } catch (e) {
    res.status(500).json({ error: "Error updating stock", details: e.message });
  }
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateProductStock,
};

