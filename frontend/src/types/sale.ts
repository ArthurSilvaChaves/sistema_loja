export interface ItemVenda {
    productId:number;
    name:string;
    quantidade:number;
    precoUnitario:number;
    subtotal:number;

}

export type FormaPagamento = 'dinheiro' | 'pix' | 'cartao';

export interface Venda {
    id: string;
    funcionario: string;
    itens:ItemVenda[];
    totalBruto: number;
    desconto: number;
    totalFinal:number;
    formaPagamento:FormaPagamento;
    dataHora: string;
}