function validateProduct(req,res,next) {
    const { name, price } = req.body;

    if(!name) {
        return res.status(404).json({
            message:"nome e obrigatorio"
        });
    }
}