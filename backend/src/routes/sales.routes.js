const express = require("express");
const router = express.Router();

const {
    createSale,
    listSales,
    getProductSalesStats
}  = require("../controllers/sales.controller");

const {
    validateCreateSale,
    validateSalesQuery
} = require("../middlewares/validadeSales")


router.post("/",validateCreateSale,createSale);
router.get("/",validateSalesQuery,listSales);
router.get("/products-stats", getProductSalesStats)

module.exports = router;

