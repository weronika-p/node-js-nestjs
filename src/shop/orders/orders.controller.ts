import { Controller, Get, HttpException, HttpStatus, Param, Res, Session } from '@nestjs/common';
import { Response } from 'express';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
    constructor(private orderService: OrdersService){}

    @Get()
    async getOrders(@Res() res: Response, @Session() session: any) {
        try {
            const orders = await this.orderService.getOrder(session.user);
            res.render(
                'orders',
                { pageTitle: 'Your Orders', orderPath: true, orders: orders, ordersCSS: true, isAuthenticated: session.isLoggedIn },
            );    
        } catch (error) {
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/:orderId')
    async getInvoice(@Param() param: {orderId: number}, @Res() res: Response, @Session() session: any) {
        const { pdfDoc, invoiceName } = await this.orderService.getInvoice(param.orderId, session.user);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=${invoiceName}`);
        pdfDoc.pipe(res);
        pdfDoc.end();
    }

}
