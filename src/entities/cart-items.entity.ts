import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { CartEntity } from './cart.entity';
import { ProductsEntity } from './products.entity';

@Entity()
export class CartItemsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CartEntity, cart => cart.cartItems, { onDelete: 'CASCADE' })
  @JoinColumn()
  cart: CartEntity;

  @ManyToOne(() => ProductsEntity, product => product.cartItems, { onDelete: 'CASCADE' })
  @JoinColumn()
  product: ProductsEntity;

  @Column()
  quantity: number;
}
