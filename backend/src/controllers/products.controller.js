let products = [
    {id:1,name:"calcinha de velha"},
    {id:2, name:"sapato preto"}
]

//GET function to /products
function getAllProducts(req,res) {
    res.json(products);
}

//GET function to /products/:id
function getProductsById(req,res){
    const id = Number(req.params.id);

    const product = products.find(p => p.id === id);

    if(!product){
        return res.status(404).json({message:"Not Found Product"});
    }

    res.json(product);
}

function createProduct(req,res){
    const { name } = req.body;

    if(!name){
        return res.status(404).json({message:"Name is Not-Null"});
    }

    const newProduct = {
        id:products.length + 1,
        name
    };

    products.push(newProduct);

    res.status(201).json(newProduct) // Request Sucessfull
}

function deleteProduct(req,res){
    const id = Number(req.params.id);

    products = products.filter(p => p.id !== id);

    res.json({message:"Product Removed"})
}

module.exports = {
    getAllProducts,
    getProductsById,
    createProduct,
    deleteProduct
};