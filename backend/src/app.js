const express = require("express");
const app = express();

const productsRoutes = require("./routes/products.routes")
const employeesRoutes = require("./routes/employees.routes")

app.use(express.json());

app.use("/products",productsRoutes)
app.use("/employees",employeesRoutes)

module.exports = app;