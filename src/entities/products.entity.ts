import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CartItemsEntity } from "./cart-items.entity";
import { CartEntity } from "./cart.entity";
import { OrderItemEntity } from "./order-item.entity";
import { UserEntity } from "./user.entity";

//properties of the class are the columns in our database
@Entity()
export class ProductsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column('double precision')
    price: number;

    @Column()
    description: string;

    @Column()
    imageUrl: string;

    @ManyToOne(() => UserEntity, (user) => user.products, { onDelete: 'CASCADE' })
    user: UserEntity

    @OneToMany(() => CartItemsEntity, cartItem => cartItem.product)
    cartItems: CartItemsEntity[];

    @OneToMany(() => OrderItemEntity, orderItem => orderItem.product)
    orderItems: OrderItemEntity[];
}