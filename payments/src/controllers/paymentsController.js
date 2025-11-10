const prisma = require("../db/prisma");
const axiosInstance = require("../utils/axiosInstance");

// Bases (com fallback)
const ORDERS_BASE   = process.env.ORDERS_BASE_URL   || "http://orders:3002/order-service/v1/orders";
const PRODUCTS_BASE = process.env.PRODUCTS_BASE_URL || "http://products:3001/product-service/v1/products";
const NOTIF_BASE    = process.env.NOTIF_BASE_URL    || "http://notification:3005/notification-service/v1/notify";

// Atualiza estoque de um produto (delta pode ser negativo para reduzir)
async function adjustProductStock(productId, delta) {
  const url = `${PRODUCTS_BASE}/${productId}/stock`;
  const resp = await axiosInstance.patch(url, { stockDelta: Number(delta) });
  return resp.data;
}

// PATCH /payment-service/v1/payments/:id/process
async function processPayment(req, res) {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findUnique({ where: { id: Number(id) } });
    if (!payment) return res.status(404).json({ error: "Payment not found" });

    if (payment.status !== "PENDING") {
      return res.status(400).json({ error: "Payment already processed or not in PENDING state" });
    }

    const orderId = String(payment.orderId);
    if (!orderId || orderId.trim().length === 0) {
      return res.status(400).json({ error: "Invalid orderId format" });
    }

    const orderResp = await axiosInstance.get(`${ORDERS_BASE}/${orderId}`);
    const order = orderResp.data;
    if (!order) {
      await prisma.payment.update({
        where: { id: Number(id) },
        data: { status: "FAILED" },
      });
      return res.status(404).json({ error: "Related order not found" });
    }

    const items = Array.isArray(order.products)
      ? order.products
      : (order.productId && order.quantity
          ? [{ productId: order.productId, quantity: order.quantity }]
          : []);

    if (!items.length) {
      await prisma.payment.update({
        where: { id: Number(id) },
        data: { status: "FAILED" },
      });
      return res.status(400).json({ error: "Order has no items" });
    }

    const updated = [];
    try {
      for (const item of items) {
        const pid = String(item.productId ?? item.id);
        const qty = Number(item.quantity ?? 1);

        const prod = (await axiosInstance.get(`${PRODUCTS_BASE}/${pid}`)).data;
        if (!prod) throw new Error(`Product ${pid} not found`);
        if ((prod.stock ?? 0) < qty) throw new Error(`Insufficient stock for product ${pid}`);

        await adjustProductStock(pid, -qty);
        updated.push({ pid, qty });
      }
    } catch (e) {
      for (const u of updated) {
        try { await adjustProductStock(u.pid, +u.qty); } catch {}
      }
      await prisma.payment.update({ where: { id: Number(id) }, data: { status: "FAILED" } });
      try { await axiosInstance.patch(`${ORDERS_BASE}/${orderId}/status`, { status: "CANCELED" }); } catch {}
      return res.status(400).json({ error: e.message });
    }

    const successProbability = parseFloat(process.env.PAYMENT_SUCCESS_PROB || "0.7");
    const ok = Math.random() <= successProbability;

    if (!ok) {
      for (const u of updated) {
        try { await adjustProductStock(u.pid, +u.qty); } catch {}
      }
      await prisma.payment.update({ where: { id: Number(id) }, data: { status: "FAILED" } });
      try { await axiosInstance.patch(`${ORDERS_BASE}/${orderId}/status`, { status: "CANCELED" }); } catch {}
      return res.status(402).json({ error: "Payment failed (simulated)" });
    }

    const processed = await prisma.payment.update({
      where: { id: Number(id) },
      data: { status: "PAID" },
    });

    axiosInstance.patch(`${ORDERS_BASE}/${orderId}/status`, { status: "PAID" });

    // axiosInstance.post(NOTIF_BASE, {
    //   clientId: order.userId ?? order.clientId,
    //   message: `Your order ${orderId} was paid and confirmed.`,
    // }).catch(() => {});

    return res.json({ success: true, payment: processed });
  } catch (error) {
    console.error("processPayment error:", error);
    return res.status(500).json({ error: "Error processing payment", details: error.message });
  }
}

// POST /payment-service/v1/payments
async function createPayment(req, res) {
  try {
    let { orderId, amount, status } = req.body;
    if (!orderId || typeof orderId !== "string") {
      return res.status(400).json({ error: "Invalid orderId format" });
    }
    const p = await prisma.payment.create({
      data: {
        orderId,
        amount: Number(amount),
        status: status || "PENDING",
      },
    });
    return res.status(201).json(p);
  } catch (err) {
    return res.status(500).json({ error: "Error creating payment", details: err.message });
  }
}

async function getAllPayments(req, res) {
  try {
    const { order_id } = req.query;
    const where = order_id ? { orderId: order_id } : {};
    const payments = await prisma.payment.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return res.json(payments);
  } catch (err) {
    return res.status(500).json({ error: "Error fetching payments", details: err.message });
  }
}

async function getPaymentById(req, res) {
  try {
    const { id } = req.params;
    const payment = await prisma.payment.findUnique({ where: { id: Number(id) } });
    if (!payment) return res.status(404).json({ error: "Payment not found" });
    return res.json(payment);
  } catch (err) {
    return res.status(500).json({ error: "Error fetching payment", details: err.message });
  }
}

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById,
  processPayment,
};
