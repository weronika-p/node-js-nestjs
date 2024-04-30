import { Module } from '@nestjs/common';
import { AdminModule } from 'src/admin/admin.module';
import { CartController } from './cart/cart.controller';
import { CartService } from './cart/cart.service';
import { CheckoutController } from './checkout/checkout.controller';
import { CheckoutService } from './checkout/checkout.service';
import { ProductsListController } from './products-list/products-list.controller';
import { OrdersController } from './orders/orders.controller';
import { CartRepository } from 'src/repositories/cart.repository';
import { CartEntity } from 'src/entities/cart.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItemsEntity } from 'src/entities/cart-items.entity';
import { CartItemsRepository } from 'src/repositories/cart-items.repository';
import { ProductsRepository } from 'src/repositories/products.repository';
import { ProductsEntity } from 'src/entities/products.entity';
import { OrdersService } from './orders/orders.service';
import { OrderEntity } from 'src/entities/order.entity';
import { OrderItemEntity } from 'src/entities/order-item.entity';
import { OrderRepository } from 'src/repositories/order.repository';
import { OrderItemRepository } from 'src/repositories/order-item.repository';

@Module({
  imports: [AdminModule, TypeOrmModule.forFeature([CartEntity, CartItemsEntity, ProductsEntity, OrderEntity, OrderItemEntity])],
  controllers: [CartController, CheckoutController, ProductsListController, OrdersController],
  providers: [
    CartService,
    CheckoutService,
    OrdersService,
    CartRepository,
    CartItemsRepository,
    ProductsRepository,
    OrderRepository,
    OrderItemRepository
  ],
  exports: [CartService, OrdersService]
})
export class ShopModule {}
