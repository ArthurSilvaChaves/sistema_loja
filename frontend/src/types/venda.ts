export interface SaleItemResponse {
    id:number;
    quantity:number;
    unitPrice: number;
    productId:number;
    product: {
        id:number;
        name:string;
    };
}

export interface SaleResponse {
    id:number;
    data:string;
    total:number;
    paymentMethod:string;
    employeeId:number;
    employee :{
        id:number;
        name:string;
    };
    items: SaleItemResponse[];
}

export interface ProductSalesStats {
    productId: number;
    productName: string;
    totalQuantity:number;
    salesCount: number;
}