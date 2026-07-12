const prisma = require("../database/prisma");

const loginEmployee = async(req,res) => {
    try {
        const { name, cpf } = req.body;

        const employee = await prisma.employee.findUnique({
            where: {cpf:cpf},
        });

        if(!employee || employee.name !== name){
            return res.status(401).json({error:"nome ou cpf invalidos. "});
        }

        const token = `token_func${employee.id}`;

        return res.status(200).json({
            message:"login bem sucedido",
            token:token,
            employee: { id: employee.id, name:employee.name }
        });

    } catch (erro){
        console.error('erro no login: ', erro);
        return res.status(500).json({error:'erro interno no servidor'})
    }
};

module.exports = { loginEmployee };