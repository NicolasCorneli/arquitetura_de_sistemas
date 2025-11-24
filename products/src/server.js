const express = require("express");
const routes = require("./routes/productsRoutes");
const app = express();
app.use(express.json());
app.use("/product-service/v1/products", routes);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Products service on ${PORT}`));
