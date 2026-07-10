const validateCPF = require("../middlewares/validateCpf")

function validateEmployee(req,res,next){
    const { cpf, name, email, telefone} = req.body;

    if (!cpf || !validateCPF(cpf)){
        return res.status(400).json({
            message:"cpf invalido"
        })
    }

    next()
}

module.exports = validateEmployee;