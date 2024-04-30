import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { EditProductController } from './edit-product/edit-product.controller';
import { EditProductService } from './edit-product/edit-product.service';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';
import { AddProductController } from './add-product/add-product.controller';
import { AddProductService } from './add-product/add-product.service';
import { AdminController } from './admin.controller';
import { DeleteProductController } from './delete-product/delete-product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsEntity } from 'src/entities/products.entity';
import { ProductsRepository } from 'src/repositories/products.repository';
import { UserEntity } from 'src/entities/user.entity';
import { UserRepository } from 'src/repositories/user.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductsEntity, UserEntity]), AuthModule],
  controllers: [EditProductController, ProductsController, AddProductController, AdminController, DeleteProductController],
  providers: [AdminService, EditProductService, ProductsService, AddProductService, ProductsRepository, UserRepository],
  exports: [AdminService, UserRepository]
})
export class AdminModule {}
