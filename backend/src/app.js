const express = require("express");
const cors = require('cors');
const productsRoutes = require("./routes/products.routes")
const employeesRoutes = require("./routes/employees.routes")
const authRoutes = require("./routes/auth.routes");

const app = express();
app.use(cors());

app.use(express.json());

app.use("/auth",authRoutes)
app.use("/products",productsRoutes)
app.use("/employees",employeesRoutes)

module.exports = app;