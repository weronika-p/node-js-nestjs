import { Controller, Get, HttpException, HttpStatus, Res, Session } from '@nestjs/common';
import { Response } from 'express';
import { AdminService } from '../admin.service';

@Controller('admin/products')
export class ProductsController {
    constructor (private readonly adminService: AdminService){}

    @Get()
    async getProducts(@Res() res: Response, @Session() session: any) {
        try {
            const products = await this.adminService.fetchAllProductsByUser(session.user);
            res.render(
                'products',
                { prods:  products, pageTitle: 'Admin Products', adminProductsPath: true, productCSS: true, isAuthenticated: session.isLoggedIn },
            );    
        } catch (error) {
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
