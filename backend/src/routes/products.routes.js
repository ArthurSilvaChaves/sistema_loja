const express = require("express");
const router = express.Router();

const {
    getAllProducts,
    getProductsById,
    createProduct,
    deleteProduct
} = require("../controllers/products.controller");

router.get("/",getAllProducts);
router.get("/:id",getProductsById);
router.post("/",createProduct)
router.delete("/:id",deleteProduct)

module.exports = router;