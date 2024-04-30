import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CartEntity } from "./cart.entity";
import { OrderEntity } from "./order.entity";
import { ProductsEntity } from "./products.entity";

//properties of the class are the columns in our database
@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    resetToken: string;
    
    @Column({ nullable: true })
    resetTokenExpiration: Date;

    @OneToMany(() => ProductsEntity, (product) => product.user)
    products: ProductsEntity[];

    @OneToOne(() => CartEntity, (cart) => cart.user)
    cart: CartEntity;

    @OneToMany(() => OrderEntity, (order) => order.user)
    orders: OrderEntity[];
}