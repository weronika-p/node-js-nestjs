import { Controller, Get, HttpException, HttpStatus, Param, Render, Req, Res, Session } from '@nestjs/common';
import { Request, Response } from 'express';
import { CartEntity } from 'src/entities/cart.entity';
import { CartProducts } from 'src/models/cart-products.model';
import { CartService } from '../cart/cart.service';
import { OrdersService } from '../orders/orders.service';
import { CheckoutService } from './checkout.service';

@Controller('checkout')
export class CheckoutController {
    constructor(private cartService: CartService, private checkoutService: CheckoutService, private orderService: OrdersService){}
    
    // @Get()
    // @Render('checkout')
    // async getCheckout(@Session() session: any, @Req() req: Request) {
    //     const user = session.user;
    //     try {
    //         const cart: any = await this.cartService.getCart(user);
    //         const cartProducts: CartProducts[] = await this.cartService.getCartProducts(cart[0]);
    //         const total: number = this.checkoutService.getTotal(cartProducts);
    //         const url = `${req.protocol}://${req.get("host")}/checkout/`;
    //         await this.checkoutService.createStripeSession(cartProducts, user, url);
    //         return { pageTitle: 'Checkout', checkoutPath: true, products: cartProducts, totalSum: total,  cartCSS: true, sessionId: session.id};
    //     } catch (error) {
    //         throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }

    // @Get('/success')
    // async getCheckoutSuccess(@Session() session: any) {
    //     const user = session.user;
    //     try {
    //         const cart: any = await this.cartService.getCart(user);
    //         const cartProducts: CartProducts[] = await this.cartService.getCartProducts(cart[0]);
    //         return await this.orderService.createOrder(user, cartProducts, cart[0]);    
    //     } catch (error) {
    //         throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }
    @Get(':status(success|cancel)?') // Matches both /checkout/success and /checkout/cancel
    @Render('checkout')
    async handleCheckout(@Session() session: any, @Req() req: Request, @Param('status') status: string, @Res() res: Response) {
        const user = session.user;
        try {
            const cart: CartEntity[] = await this.cartService.getCart(user);
            const cartProducts: CartProducts[] = await this.cartService.getCartProducts(cart[0]);
            if (status === 'success') {
                // Handle success logic
                await this.orderService.createOrder(user, cartProducts, cart[0]);
                return res.redirect('/orders');
            } else {
                // Handle normal checkout logic
                const total: number = this.checkoutService.getTotal(cartProducts);
                const url = `${req.protocol}://${req.get("host")}/checkout/`;
                const stripeSession = await this.checkoutService.createStripeSession(cartProducts, user, url);
                return { pageTitle: 'Checkout', checkoutPath: true, products: cartProducts, totalSum: total,  cartCSS: true, sessionId: stripeSession.id };
            }
        } catch (error) {
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
