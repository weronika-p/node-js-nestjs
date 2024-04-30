import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { CartEntity } from './cart.entity';
import { OrderEntity } from './order.entity';
import { ProductsEntity } from './products.entity';

@Entity()
export class OrderItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrderEntity, order => order.orderItems, { onDelete: 'CASCADE' })
  @JoinColumn()
  order: OrderEntity;

  @ManyToOne(() => ProductsEntity, product => product.orderItems, { onDelete: 'CASCADE' })
  @JoinColumn()
  product: ProductsEntity;

  @Column()
  quantity: number;
}
