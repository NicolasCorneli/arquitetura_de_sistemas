const express = require("express");
const { connect } = require("./db/mongo");
const orderRoutes = require("./routes/ordersRoutes");

const app = express();
app.use(express.json());
app.use("/order-service/v1/orders", orderRoutes);

const PORT = process.env.PORT || 3002;

connect()
  .then(() => app.listen(PORT, () => console.log(`✅ Orders service on ${PORT}`)))
  .catch(err => { console.error("Mongo connect failed", err); process.exit(1); });
