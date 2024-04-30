import { Controller, Get, HttpException, HttpStatus, Query, Render } from '@nestjs/common';
import { AdminService } from './admin/admin.service';
import { SkipAuth } from './decorator/skip-auth.decorator';

@Controller()
export class AppController {
  constructor (private readonly adminService: AdminService){}

  @Get()
  @SkipAuth()
  @Render('home')
  async root(@Query() query?: {page: string}) {
    const page = +query?.page || 1;
    try {
      const { numProducts, products, hasNextPage, lastPage, canLastPageBeDisplayed, isNotFirstPage } = await this.adminService.fetchAll(page);
      return {
        prods:  products,
        pageTitle: 'Shop',
        indexPath: true,
        productCSS: true,
        totalProducts: numProducts,
        hasNextPage: hasNextPage,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: lastPage,
        currentPage: page,
        canLastPageBeDisplayed: canLastPageBeDisplayed,
        isNotFirstPage: isNotFirstPage
      }  
    } catch (error) {
      throw new HttpException(error?.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}