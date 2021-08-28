require("dotenv").config();
const express = require("express");
const authRoutes = require("./src/routes/authRoute");
const userRoutes = require("./src/routes/userRoute");
const app = express();
const port = process.env.PORT || 8000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.listen(port, console.log(`SERVER STARTED AT PORT ${port}`));