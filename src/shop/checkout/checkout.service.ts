import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/entities/user.entity';
import { CartProducts } from 'src/models/cart-products.model';

@Injectable()
export class CheckoutService {
    stripeSecretKey: string = process.env.STRIPE_KEY;

    getTotal(products: CartProducts[]): number {
        let total = 0;
        products.forEach((p: CartProducts) => total += p.qty * p.productData.price);

        return total;
    }

    async createStripeSession(products: CartProducts[], user: UserEntity, url: string) {
        const stripe = require('stripe')(this.stripeSecretKey);
        return await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: products.map((p: CartProducts) => {
                return {
                    quantity: p.qty,
                    price_data: {
                        currency: "usd",
                        unit_amount: p.productData.price * 100,
                        product_data: {
                            name: p.productData.title,
                            description: p.productData.description,
                        },
                    }
                };
            }),
            customer_email: user.email,
            success_url: `${url}success`,
            cancel_url: `${url}cancel`,
        });
    }
}
