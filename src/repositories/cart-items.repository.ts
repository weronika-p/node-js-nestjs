import { InjectRepository } from "@nestjs/typeorm";
import { CartItemsEntity } from "src/entities/cart-items.entity";
import { Repository } from "typeorm"

export class CartItemsRepository extends Repository<CartItemsEntity> {
    constructor(
        @InjectRepository(CartItemsEntity)
        private cartItemsRepository: Repository<CartItemsEntity>
    ) {
        super(cartItemsRepository.target, cartItemsRepository.manager, cartItemsRepository.queryRunner);
    }

    
}