// payments/src/server.js
const express = require("express");
const paymentsRoutes = require("./routes/paymentsRoutes");
const { startKafkaConsumer } = require("./kafka/consumer");

const app = express();
app.use(express.json());

// Rotas HTTP
app.use("/payment-service/v1/payments", paymentsRoutes);

const PORT = process.env.PORT || 3003;

// Inicializa HTTP + Kafka
app.listen(PORT, async () => {
  console.log(`✅ Payments service running on port ${PORT}`);
  console.log("🔄 Starting Kafka consumer...");
  await startKafkaConsumer();
});
