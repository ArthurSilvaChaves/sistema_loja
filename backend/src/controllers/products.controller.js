const prisma = require("../database/prisma");

//GET function to /products
async function getAllProducts(req,res) {
    try{

        const products = await prisma.product.findMany();

        res.json(products);
    } catch (error) {
        res.status(500).json({message:"erro ao buscar produtos."});
    }
}

//GET function to /products/:id
async function getProductsById(req,res){
    try{
        const id = Number(req.params.id);

        const product = await prisma.product.findUnique({
            where: { id }
        });
        
        if(!product) { 
            return res.status(404).json({
                message:"produto nao encontrado."
            });
        }

        res.json(product)

    } catch (error){
        res.status(500).json({
            message:"erro ao buscar produto."
        });
    }
}
//POST function for create a product
async function createProduct(req,res){
    const { name, price, inventory } = req.body;

    const product = await prisma.product.create({
        data: {
            name,
            price,
            inventory
        }
    });

    res.status(201).json(product);


}

//PUT function to update a product
async function updateProduct(req,res) {
    try{
        const id = Number(req.params.id);

        const { name, price, inventory } = req.body;

        const product = await prisma.product.update({
            where: { id },
            data: {
                name,
                price,
                inventory
            }
        });

        res.json(product)
        
    } catch (error) {
        res.status(500).json({
            message:"erro ao atualizar"
        })
    }

}

//DELETE function
async function deleteProduct(req,res){
    try{
        const id = Number(req.params.id);

        await prisma.product.delete({
            where: { id }
        });
        
        res.status(204).send();
    } catch (error){
        res.status(500).json({
            message:"erro ao excluir"
        });
    }

}

//exports to route
module.exports = {
    getAllProducts,
    getProductsById,
    createProduct,
    updateProduct,
    deleteProduct
};