import { Body, Controller, Get, HttpException, HttpStatus, ParseFilePipeBuilder, Post, Req, Res, Session, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AdminService } from '../admin.service';
import { Request, Response } from 'express';
import { ProductDto } from 'src/dto/product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/util/storage';

@Controller('admin/add-product')
export class AddProductController {
    constructor(private readonly adminService: AdminService) {}

    @Get()
    getAddProduct(@Res() res: Response, @Session() session: any, @Req() req: Request) {
        const error = req.flash('error');
        return res.render(
            'edit-product',
            {
                pageTitle: 'Add Product',
                addProductPath: true,
                formsCSS: true,
                productCSS: true,
                isAuthenticated: session.isLoggedIn,
                product: req.flash('old') ?? {title: '', imageUrl: '', price: '', description: ''},
                isEditingOrHasError: error && true,
                error: error ?? null
            },
        );
    }

    @Post()
    @UseInterceptors(FileInterceptor('image', {storage: storage}))
    async createProduct(
        @Body() body: ProductDto,
        @Session() session: any,
        @Res() res: Response,
        @UploadedFile() image: Express.Multer.File
    ) {
        try {
            const imageUrl = image.path;
            await this.adminService.save({
                title: body.title,
                imageUrl: imageUrl,
                price: +body.price,
                description:body.description,
                user: session.user
            });
            return res.redirect('/')
        } catch (error) {
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
