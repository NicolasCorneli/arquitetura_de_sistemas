const express = require("express");
const paymentsRoutes = require("./routes/paymentsRoutes");

const app = express();
app.use(express.json());

// Routes
app.use("/payment-service/v1/payments", paymentsRoutes);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`✅ Payments service running on port ${PORT}`);
});
