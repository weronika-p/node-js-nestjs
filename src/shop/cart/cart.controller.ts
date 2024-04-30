import { Body, Controller, Get, HttpException, HttpStatus, Post, Redirect, Req, Res, Session } from '@nestjs/common';
import { Request, Response } from 'express';
import { AdminService } from 'src/admin/admin.service';
import { CartEntity } from 'src/entities/cart.entity';
import { ProductsEntity } from 'src/entities/products.entity';
import { UserEntity } from 'src/entities/user.entity';
import { CartProducts } from 'src/models/cart-products.model';
import { Cart } from 'src/models/cart.model';
import { OrdersService } from '../orders/orders.service';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
    constructor(private adminService: AdminService, private cartService: CartService, private orderService: OrdersService) {}

    @Get()
    async getCart(@Res() res: Response, @Session() session: any) {
        const user = session.user;
        try {
            let cart: any = await this.cartService.getCart(user);
            if (!cart.length) {
               cart = await this.cartService.createCart(user);
            }
            const cartProducts = await this.cartService.getCartProducts(cart[0]);
            res.render(
                'cart',
                { pageTitle: 'Your Cart', cartPath: true, products: cartProducts, cartCSS: true, isAuthenticated: session.isLoggedIn },
            );    
        } catch (error) {
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post()
    @Redirect('/cart')
    async postCart(@Body() body: any, @Session() session: any) {
        try {
            const product: ProductsEntity = await this.adminService.findById(body.productId);
            let cart: CartEntity[] = await this.cartService.getCart(session.user);
            const isCartProductExist = await this.cartService.isProductIncluded(cart[0], product);
            if (!isCartProductExist) {
                return await this.cartService.addProductToCart(cart[0], product);
            }
            return await this.cartService.incrementProduct(cart[0], product);
        } catch (error) {
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('delete-item')
    @Redirect('/cart')
    async postCartDeleteProduct(@Body() body: any, @Session() session: any) {
        try {
            const product = await this.adminService.findById(body.productId);
            const cart: any = await this.cartService.getCart(session.user);
            return await this.cartService.deleteCartProduct(cart[0], product);   
        } catch (error) {
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);   
        }
    }

    @Post('create-order')
    @Redirect('/orders')
    async postOrder(@Session() session: any) {
        const user = session.user;
        try {
            const cart: any = await this.cartService.getCart(user);
            const cartProducts: CartProducts[] = await this.cartService.getCartProducts(cart[0]);
            return await this.orderService.createOrder(user, cartProducts, cart[0]);    
        } catch (error) {
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
