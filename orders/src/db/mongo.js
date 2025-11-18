const { MongoClient } = require("mongodb");

const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/orders_db";
const DB_NAME = process.env.MONGODB_DB || "orders_db";

let client;
let db;

async function connect() {
  if (db) return db;

  client = new MongoClient(MONGODB_URL /*, options none needed */);
  await client.connect();

  // Se a URL já inclui /orders_db, isso aqui garante coerência:
  db = client.db(DB_NAME);
  console.log(`[orders] ✅ Mongo connected: ${MONGODB_URL} (db=${DB_NAME})`);
  return db;
}

function getDb() {
  if (!db) throw new Error("MongoDB not initialized. Call connect() first.");
  return db;
}

module.exports = { connect, getDb, ObjectId: require("mongodb").ObjectId };
