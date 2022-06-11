require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./src/routes/authRoute");
const userRoutes = require("./src/routes/userRoute");
const producer = require("./src/producers/producer");
const app = express();
const port = process.env.PORT || 8000;
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
producer.on("ready", () => {
  console.log(`Producer Connected to broker \nReady to start server`);
  app.listen(port, console.log(`SERVER STARTED AT PORT ${port}`));
});
producer.on("error", (err) => {
  console.log(`Unable to connect to Broker ${process.env.BROKERS_LIST}`);
  process.exit(1);
});
module.exports = app;
