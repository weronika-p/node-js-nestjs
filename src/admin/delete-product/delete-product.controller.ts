import { Body, Controller, Delete, HttpException, HttpStatus, Param, Post, Redirect, Res } from '@nestjs/common';
import { Response } from 'express';
import { Product } from 'src/models/product.model';
import { AdminService } from '../admin.service';

@Controller('admin/product')
export class DeleteProductController {
    constructor (private adminService: AdminService) {}

    @Delete('/:productId')
    async deleteProduct(@Param('productId') productId: string, @Res() res: Response) {
        try {
            await this.adminService.deleteById(productId);
            res.status(200).json({message: 'Success'});
        } catch (error) {
            res.status(500).json({message: 'Deleting product failed'});
        }
    }
}
