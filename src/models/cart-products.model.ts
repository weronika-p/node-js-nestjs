import { ProductsEntity } from "src/entities/products.entity";

export interface CartProducts {
    productData: ProductsEntity;
    qty: number;
}