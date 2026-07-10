const express = require("express");
const cors = require('cors');
const productsRoutes = require("./routes/products.routes")
const employeesRoutes = require("./routes/employees.routes")

const app = express();
app.use(cors());

app.use(express.json());


app.use("/products",productsRoutes)
app.use("/employees",employeesRoutes)

module.exports = app;