const express = require("express");
const usersRoutes = require("./routes/usersRoutes");

const app = express();
app.use(express.json());

// Routes
app.use("/user-service/v1/clients", usersRoutes);

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`✅ Users service running on port ${PORT}`);
});
