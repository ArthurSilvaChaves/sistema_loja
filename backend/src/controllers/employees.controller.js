const prisma = require("../database/prisma")

//GET
async function getAllEmployees(req,res){
    const employees = await prisma.employee.findMany();

    res.json(employees);
}

//GET by /:id

async function getEmployesById(req,res){
    const id = Number(req.params.id)

    const employee = await prisma.employee.findUnique(
        {
            where: { id }
        });
    
    if(!employee){
        return res.status(404).json({
            message:"funcionario nao encontrado"
        });
    }
        
    res.json(employee)
}

//POST 
async function createEmployee(req,res){
    const { cpf, name,telefone, email} = req.body;

    const employee = await prisma.employee.create({
        data:{
            cpf,
            name,
            telefone,
            email
        }
    });

    res.status(201).json(employee);
}

//PUT 
async function updateEmployees(req,res){
    const id = Number(req.params.id);

    const { cpf, name, telefone, email} = req.body;

    const employee = await prisma.employee.update({
        where:{ id },
        data:{
            cpf,
            name,
            telefone,
            email
        }
    });

    res.json(employee)
}

//DELETE
async function deleteEmployee(req,res){
    const id = Number(req.params.id);

    await prisma.employee.delete({
        where:{ id }
    });

    res.status(204).send();
}


module.exports = {
    getAllEmployees,
    getEmployesById,
    createEmployee,
    updateEmployees,
    deleteEmployee
};