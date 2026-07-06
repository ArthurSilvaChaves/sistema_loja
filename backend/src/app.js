const express = require("express");
const app = express();

const productsRoutes = require("./routes/products.routes")

app.use(express.json());

app.use("/products",productsRoutes)

module.exports = app;