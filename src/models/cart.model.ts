import { readFile, writeFile } from "fs";
import { join } from "path";
import rootDir from "src/util/path";
import { Product } from "./product.model";

export class Cart {
    products: Product[];
    totalPrice: number;

    deleteProduct(id: string, productPrice: number) {
        const p = join(rootDir, 'src/data', 'cart.json');
        readFile(p, 'utf-8', (err, fileContent) => {
            if (err) {
                return;
            }
            const updatedCart: Cart = { ...JSON.parse(fileContent) };
            const product = updatedCart.products.find(prod => prod.id === id);
            if (!product) {
                return;
            }
            updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
            updatedCart.totalPrice = updatedCart.totalPrice - +productPrice * product.qty;
            writeFile(p, JSON.stringify(updatedCart), (err => {
                console.error('Error writing file:', err);
            }));
        })
    }
}