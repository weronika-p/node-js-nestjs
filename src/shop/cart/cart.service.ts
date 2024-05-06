import { Injectable } from '@nestjs/common';
import { CartItemsEntity } from 'src/entities/cart-items.entity';
import { CartEntity } from 'src/entities/cart.entity';
import { ProductsEntity } from 'src/entities/products.entity';
import { UserEntity } from 'src/entities/user.entity';
import { CartItemsRepository } from 'src/repositories/cart-items.repository';
import { CartRepository } from 'src/repositories/cart.repository';
import { ProductsRepository } from 'src/repositories/products.repository';

@Injectable()
export class CartService {
    constructor(
        private cartRepository: CartRepository,
        private cartItemsRepository: CartItemsRepository,
        private productsRepository: ProductsRepository
    ){}

    async getCart(user: UserEntity) {
        return await this.cartRepository.find({ where: {user: user} });
    }

    async createCart(user: UserEntity) {
        const newCart = this.cartRepository.create({user: user});
        return await this.cartRepository.save(newCart);
    }

    async addProductToCart(cart: CartEntity, product: ProductsEntity) {
        const cartItems = this.cartItemsRepository.create({cart: cart, product: product, quantity: 1});
        return await this.cartItemsRepository.save(cartItems);
    }

    async incrementProduct(cart: CartEntity, product: ProductsEntity) {
        return await this.cartItemsRepository.increment({cart: cart, product: product}, 'quantity', 1);
    }

    async isProductIncluded(cart: CartEntity, product: ProductsEntity) {
        return await this.cartItemsRepository.existsBy({cart: cart, product: product});
    }

    async getCartProducts(cart: CartEntity) {
        const cartItems = await this.cartItemsRepository.findBy({cart: cart});
        let products: {productData: ProductsEntity, qty: number}[] = [];
        await Promise.all(cartItems.map(async (item: CartItemsEntity) => {
            const cartProduct = await this.productsRepository.findOneBy({ cartItems: item });
            products.push({productData: cartProduct, qty: item.quantity});
        }));
    
        return products;
    }

    async deleteCartProduct(cart: CartEntity, product: ProductsEntity) {
        return await this.cartItemsRepository.delete({cart: cart, product: product});
    }
}
