const express = require("express");
const router = express.Router();

const {
    getAllEmployees,
    getEmployesById,
    createEmployee,
    updateEmployees,
    deleteEmployee
} = require("../controllers/employees.controller");
const { updateProduct } = require("../controllers/products.controller");

router.get("/",getAllEmployees);
router.get("/:id",getEmployesById);
router.post("/",createEmployee);
router.put("/:id",updateEmployees)
router.delete("/:id",deleteEmployee)

module.exports = router;
