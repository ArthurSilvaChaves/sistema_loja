const express = require("express");
const router = express.Router();

//require's for middlewares validates
const validateProduct = require("../middlewares/validateProduct");
// const validateEmployee = require("../middlewares/validateEmployee");



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
router.post("/",validateProduct,createProduct);
router.put("/:id",updateProduct);
router.delete("/:id",deleteProduct);

//exports to app
module.exports = router;