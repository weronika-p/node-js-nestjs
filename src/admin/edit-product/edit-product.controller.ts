import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseFilePipeBuilder, Post, Query, Redirect, Req, Res, Session, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response, Request } from 'express';
import { ProductDto } from 'src/dto/product.dto';
import { CustomUploadFileTypeValidator } from 'src/filters/file-upload.validators';
import { RedirectIfNoEditQueryInterceptor } from 'src/interceptors/redirect.interceptor';
import { Product } from 'src/models/product.model';
import { deleteFile, isValidFileType } from 'src/util/file';
import { storage, VALID_UPLOADS_MIME_TYPES } from 'src/util/storage';
import { AdminService } from '../admin.service';

@Controller('admin/edit-product')
export class EditProductController {
    constructor(private adminService: AdminService) {}

    @Get('/:id')
    @UseInterceptors(RedirectIfNoEditQueryInterceptor)
    async getEditProduct(@Res() res: Response, @Query() queries: any, @Param('id') id: string, @Session() session: any, @Req() req: Request) {
        const error = req.flash('error');
        const prevValues = req.flash('old');
        let product;
        try {
            if (prevValues) {
                product = prevValues;
                product.productId = id;
            } else {
                product = await this.adminService.getProductToEdit(id, session.user);
            }
            return res.render(
                'edit-product',
                {
                    pageTitle: 'Edit Product',
                    formsCSS: true,
                    productCSS: true,
                    editing: queries.edit,
                    product: product,
                    isAuthenticated: session.isLoggedIn,
                    isEditingOrHasError: true,
                    error: error ?? null
                }
            );
        } catch (error) {
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post()
    @UseInterceptors(FileInterceptor('image', {storage: storage}))
    @Redirect('/admin/products')
    async postEditProduct(
        @Body() prod: ProductDto,
        @Session() session: any,
        @UploadedFile() image: Express.Multer.File | undefined
    ) {
        const imageUrl = image?.path;
        
        try {
            const product = await this.adminService.getProductToEdit(prod.productId, session.user);
            if (image) {
                deleteFile(product.imageUrl);
                if (!isValidFileType(image.mimetype)) {
                    throw new HttpException('Invalid file type', HttpStatus.UNPROCESSABLE_ENTITY);
                }
            }
            const updatedProduct: Product = {
                id: prod.productId,
                title: prod.title,
                imageUrl: imageUrl || product.imageUrl,
                price: prod.price,
                description: prod.description
            }
            await this.adminService.save(updatedProduct);
        } catch (error) {
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
