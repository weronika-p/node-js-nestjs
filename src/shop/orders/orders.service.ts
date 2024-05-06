import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { createReadStream, createWriteStream, readFileSync, ReadStream } from 'fs';
import { join } from 'path';
import { CartEntity } from 'src/entities/cart.entity';
import { OrderEntity } from 'src/entities/order.entity';
import { UserEntity } from 'src/entities/user.entity';
import { CartProducts } from 'src/models/cart-products.model';
import { CartRepository } from 'src/repositories/cart.repository';
import { OrderItemRepository } from 'src/repositories/order-item.repository';
import { OrderRepository } from 'src/repositories/order.repository';
import rootDir from 'src/util/path';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class OrdersService {
    constructor(
        private orderRepository: OrderRepository,
        private orderItemRepository: OrderItemRepository,
        private cartRepository: CartRepository
    ){}

    async createOrder(user: UserEntity, cartProducts: CartProducts[], cart: CartEntity) {
        const newOrder: OrderEntity = this.orderRepository.create({user: user});
        const savedOrder: OrderEntity = await this.orderRepository.save(newOrder);
        await Promise.all(cartProducts.map(async (cartProduct: CartProducts) => {
            const orderItem = this.orderItemRepository.create({order: savedOrder, product: cartProduct.productData, quantity: cartProduct.qty});
            await this.orderItemRepository.save(orderItem);
        }));
        return await this.cartRepository.delete(cart)
    }

    async getOrder(user: UserEntity) {
        const order = await this.orderRepository.find({
            where: {user: user},
            relations: ['orderItems', 'orderItems.product']
        });
        
        return order;
    }

    async getInvoice(orderId: number, user: UserEntity) {
        try {
            const order = await this.orderRepository.find({where: {id: orderId}, relations: ['user', 'orderItems', 'orderItems.product']});
            if (!order?.length) {
                throw new NotFoundException(`Order with ID "${orderId}" not found`);
            }
            if (order[0].user.id !== user.id) {
                throw new UnauthorizedException('Unauthorized');
            }
            const invoiceName = `invoice-${orderId}.pdf`;
            const invoicePath = join(rootDir, 'data/invoices', invoiceName);
            const pdfDoc = new PDFDocument();
            pdfDoc.pipe(createWriteStream(invoicePath));
            pdfDoc.fontSize(26).text('Invoice', {
                underline: true
            });
            pdfDoc.text('-----------------------');
            let totalPrice = 0;
            order[0].orderItems.forEach(item => {
                totalPrice += item.quantity * item.product.price;
                pdfDoc.fontSize(14).text(`${item.product.title} - ${item.quantity} x ${item.product.price}`);
            });
            pdfDoc.text('---');
            pdfDoc.fontSize(20).text(`Total Price: $${totalPrice}`);
            // const data = readFileSync(invoicePath);
            // const data = createReadStream(invoicePath);
            return {pdfDoc, invoiceName};
        } catch (error) {
            throw new HttpException(error || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
