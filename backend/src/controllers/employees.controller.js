const prisma = require("../database/prisma")

//GET
async function getAllEmployees(req,res){
    const employees = await prisma.employee.findMany()

    res.json(employees);
}

//GET by /:id

//POST 

//PUT 

//DELETE

module.exports = {
    getAllEmployees
};