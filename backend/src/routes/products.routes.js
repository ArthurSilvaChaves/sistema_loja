const express = require("express");
const router = express.Router();

//const require for controller
const {
    getAllProducts,
    getProductsById,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/products.controller");

router.get("/",getAllProducts);
router.get("/:id",getProductsById);
router.post("/",createProduct);
router.put("/:id",updateProduct);
router.delete("/:id",deleteProduct);

//exports to app
module.exports = router;