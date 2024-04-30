import { Controller, Get, HttpException, HttpStatus, Param, Query, Res, Session } from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import { Response } from 'express';
import { SkipAuth } from 'src/decorator/skip-auth.decorator';

@Controller('products')
export class ProductsListController {
    constructor (private readonly adminService: AdminService){}

    @Get()
    @SkipAuth()
    async getProducts(@Res() res: Response, @Session() session: any, @Query() query?: {page: string}) {
        const page = +query?.page || 1;
        try {
            const { numProducts, products, hasNextPage, lastPage, canLastPageBeDisplayed, isNotFirstPage } = await this.adminService.fetchAll(page);
            res.render('products-list', {
            prods: products,
            pageTitle: 'All Products',
            productsPath: true,
            productCSS: true,
            isAuthenticated: session.isLoggedIn,
            totalProducts: numProducts,
            hasNextPage: hasNextPage,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: lastPage,
            currentPage: page,
            canLastPageBeDisplayed: canLastPageBeDisplayed,
            isNotFirstPage: isNotFirstPage,
            })
        } catch (error) {
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/:id')
    async getProductById(@Param('id') id: string, @Res() res: Response, @Session() session: any) {
        try {
            const product = await this.adminService.findById(id);
            res.render('product-detail', {
                product: product,
                pageTitle: product.title,
                productsPath: true,
                isAuthenticated: session.isLoggedIn
            });    
        } catch (error) {
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
