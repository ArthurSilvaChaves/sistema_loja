const { start } = require("node:repl");

function validateCreateSale(req,res,next) {
    const { employeeId, paymentMethod, items } = req.body

    if(!employeeId){
        return res.status(400).json({error:"id do funcionario obrigatorio!"});
    }

    if(!paymentMethod || paymentMethod !== "string") {
        return res.status(400).json({error:"metodo de pagamento obrigatorio"});
    }

    if(!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({error:"items deve ser um array com no minimo um item"});
    }

    for(const item of items) {
        if (!item.productId || item.quantity) {
            return res.status(400).json({error:"id do produto e quantidade sao obrigatorios"})
        }

        if(typeof item.quantity !== "number" || item.quantity <= 0) {
            return res.status(400).json({error:"quantidade precisa ser um numero"});
        }
    }

    next();

}

function validateSalesQuery(req,res,next) {
    const { startDate, endDate } = req.query;

    if (startDate && isNaN(Date.parse(startDate))) {
        return res.status(400).json({ error:"data de inicio invalida" });
    }

    if(endDate && isNaN(Date.parse(endDate))) {
        return res.status(400).json({ error:"data final invalida" });
    }

    if(startDate && endDate && new Date(startDate) > new Date(endDate)) {
        return res.status(400).json({ error:"data de inicio nao pode ser depois que data final"});
    }

    next();
}

module.exports = {
    validateSalesQuery,
    validateCreateSale
}