import { Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CartItemsEntity } from "./cart-items.entity";
import { ProductsEntity } from "./products.entity";
import { UserEntity } from "./user.entity";

//properties of the class are the columns in our database
@Entity()
export class CartEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => UserEntity, (user) => user.cart)
    @JoinColumn()
    user: UserEntity;

    @OneToMany(() => CartItemsEntity, cartItem => cartItem.cart)
    cartItems: CartItemsEntity[];
}