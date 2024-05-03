import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { NotFoundFilter } from './filters/not-found.filter';
import { AdminModule } from './admin/admin.module';
import { ShopModule } from './shop/shop.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsEntity } from './entities/products.entity';
import { UserEntity } from './entities/user.entity';
import { CartEntity } from './entities/cart.entity';
import { CartItemsEntity } from './entities/cart-items.entity';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from './entities/order-item.entity';
import { AuthModule } from './auth/auth.module';
import { AuthExceptionFilter } from './filters/auth-exception.filter';
import { AuthGuard } from './auth/auth.guard';
import { FlashMiddleware } from './middleware/flash.middleware';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ValidationExceptionFilter } from './filters/validation-exception.filter';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AdminModule, ShopModule, AuthModule, TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: 5432,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB_NAME,
    entities: [ProductsEntity, UserEntity, CartEntity, CartItemsEntity, OrderEntity, OrderItemEntity],
    synchronize: true,
    logging: true
  }), ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: NotFoundFilter,
    },
    {
      provide: APP_FILTER,
      useClass: AuthExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ValidationExceptionFilter
    }
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FlashMiddleware).forRoutes('*');
  }
}
