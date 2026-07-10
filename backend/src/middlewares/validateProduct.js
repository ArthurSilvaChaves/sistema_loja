function validateProduct(req,res,next) {
    const { name, price } = req.body;

    if(!name) {
        return res.status(400).json({
            message:"nome e obrigatorio"
        });
    }

    if(price == null) {
        return res.status(400).json({
            message:"preco nao pode ser nulo"
        });
    }

    if(price <= 0){
        return res.status(400).json({
            message:"preco precisa ser maior que 0"
        });
    }

    next();
}

module.exports = validateProduct;