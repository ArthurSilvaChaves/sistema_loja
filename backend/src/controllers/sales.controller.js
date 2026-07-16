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

async function listSales(req,res) {
  const { startDate, endDate} = req.query;

  try {
    const where = {};

    if (startDate || endDate) {
      where.data = {};
      if (startDate) where.data.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.data.lte = end;
      }
    }

    const sales = await prisma.sale.findMany({
      where,
      include: {
        employee: { select: { id:true, name:true } },
        items: {
          include: {
            product : { select: {id:true,name:true}},
          },
        },
      },
      orderBy: {data:"desc"}
    });

    res.status(200).json(sales);
  } catch (error) {
    res.status(400).json({error:error.message});
  }
}

async function getProductSalesStats(req,res){
  try {
    const stats = await prisma.saleItem.groupBy({
      by: ["productId"],
      _sum:{ quantity:true },
      _count: {id:true }
    });

    const productIds = stats.map((s) => s.productId);
    const products = await prisma.product.findMany({
      where: { id:{ in:productIds} },
      select: { id:true, name:true},
    });

    const result = stats
    .map((s) => {
      const product = products.find((p) => p.id === s.productId);
      return {
        productId:s.productId,
        productName:product?.name ?? "produto removido",
        totalQuantity: s._sum.quantity,
        salesCount:s._count.id,
      };
    })
    .sort((a,b) => b.totalQuantity - a.totalQuantity);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({error:error.message});
  }
}

module.exports = { createSale,listSales,getProductSalesStats };