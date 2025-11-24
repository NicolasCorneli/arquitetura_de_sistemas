// seeds/seed.js
const axios = require("axios");

const PRODUCTS_URL = process.env.PRODUCTS_URL || "http://products:3001/product-service/v1/products";
const USERS_URL = process.env.USERS_URL || "http://users:3004/user-service/v1/clients";
const ORDERS_URL = process.env.ORDERS_URL || "http://orders:3002/order-service/v1/orders";

async function sleep(ms){ return new Promise(r=>setTimeout(r, ms)); }

async function createProducts() {
  const products = [
    { name: "Chuteira A", price: 199.9, stock: 10 },
    { name: "Chuteira B", price: 299.9, stock: 5 },
    { name: "Bola Oficial", price: 79.9, stock: 20 },
  ];
  const created = [];
  for (const p of products) {
    try {
      const r = await axios.post(PRODUCTS_URL, p);
      created.push(r.data);
    } catch (err) {
      console.error("createProducts error:", err.response && err.response.data || err.message);
    }
  }
  return created;
}

async function createUsers() {
  const users = [
    { name: "Alice", email: "alice@example.com" },
    { name: "Bob", email: "bob@example.com" }
  ];
  const created = [];
  for (const u of users) {
    try {
      const r = await axios.post(USERS_URL, u);
      created.push(r.data);
    } catch (err) {
      console.error("createUsers error:", err.response && err.response.data || err.message);
    }
  }
  return created;
}

async function createOrderWithPayment(userId, products) {
  // products = [{ productId: <id>, quantity: n }, ...]
  const body = {
    userId,
    products,
    payment: {
      method: "CREDIT_CARD",
      amount: products.reduce((s,p)=>s + (p.price || 0) * p.quantity, 0)
    }
  };
  try {
    const r = await axios.post(ORDERS_URL, body);
    console.log("Order created:", r.data._id);
    return r.data;
  } catch (err) {
    console.error("createOrderWithPayment error:", err.response && err.response.data || err.message);
  }
}

async function main(){
  console.log("Seeder starting... wait 6s for services to be up");
  await sleep(6000);

  const prods = await createProducts();
  const users = await createUsers();

  if (!prods.length || !users.length) {
    console.error("Missing products or users, aborting seeder.");
    return;
  }

  const order = await createOrderWithPayment(
    Number(users[0].id || users[0].userId || users[0].id),
    [
      { productId: Number(prods[0].id || prods[0].productId), quantity: 1, price: prods[0].price },
      { productId: Number(prods[1].id || prods[1].productId), quantity: 2, price: prods[1].price }
    ]
  );

  console.log("Seeder finished. Created order:", order && order._id);
}

main().catch(err => {
  console.error("Seeder fatal:", err);
  process.exit(1);
});
