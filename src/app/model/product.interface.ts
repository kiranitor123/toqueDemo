export interface Product {
    name: string;
    price: number;
    unit: string;
}

export interface ProductDTO  {
    name: string;
    price: number;
    unit: string;
    supplierId: string;
}