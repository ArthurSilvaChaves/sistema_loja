
const { create } = require("node:domain");
const prisma = require("../database/prisma")

async function createSale(req, res) {
  const { employeeId, paymentMethod, items } = req.body;
  // items esperado: [{ productId: 1, quantity: 2 }, { productId: 3, quantity: 1 }]

  try {
    const sale = await prisma.$transaction(async (tx) => {
      // 1. Busca os produtos envolvidos e valida estoque
      const productIds = items.map((item) => item.productId);
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
      });

      let total = 0;

      for (const item of items) {
        const product = products.find((p) => p.id === item.productId);

        if (!product) {
          throw new Error(`Produto ${item.productId} não encontrado`);
        }

        if (product.inventory < item.quantity) {
          throw new Error(`Estoque insuficiente para ${product.name}`);
        }

        total += product.price * item.quantity;
      }

      // 2. Cria a venda (Sale)
      const newSale = await tx.sale.create({
        data: {
          employeeId,
          paymentMethod,
          total,
        },
      });

      // 3. Cria os itens da venda (SaleItem) e dá baixa no estoque
      for (const item of items) {
        const product = products.find((p) => p.id === item.productId);

        await tx.saleItem.create({
          data: {
            saleId: newSale.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: product.price, // preço "congelado" no momento da venda
          },
        });

        await tx.product.update({
          where: { id: item.productId },
          data: {
            inventory: { decrement: item.quantity },
          },
        });
      }

      return newSale;
    });

    res.status(201).json(sale);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = createSale;