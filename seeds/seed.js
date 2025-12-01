// seeds/seed.js
const axios = require("axios");

const PRODUCTS_URL = process.env.PRODUCTS_URL || "http://products:3001/product-service/v1/products";
const USERS_URL = process.env.USERS_URL || "http://users:3004/user-service/v1/clients";

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
      console.log("Created product:", r.data);
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
      console.log("Created user:", r.data);
    } catch (err) {
      console.error("createUsers error:", err.response && err.response.data || err.message);
    }
  }
  return created;
}

async function main() {
  console.log("Seeder started - creating only users and products");
  // aguarda os serviços subirem (10s)
  await sleep(10000);

  const prods = await createProducts();
  const users = await createUsers();

  if (!prods.length || !users.length) {
    console.error("Missing products or users, aborting seeder.");
    process.exit(1);
  }
  console.log("Seeder finished. Created", prods.length, "products and", users.length, "users.");
  process.exit(0);
}

main().catch(err => {
  console.error("Seeder fatal:", err);
  process.exit(1);
});
