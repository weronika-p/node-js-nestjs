import { InjectRepository } from "@nestjs/typeorm";
import { CartEntity } from "src/entities/cart.entity";
import { Repository } from "typeorm"

export class CartRepository extends Repository<CartEntity> {
    constructor(
        @InjectRepository(CartEntity)
        private cartRepository: Repository<CartEntity>
    ) {
        super(cartRepository.target, cartRepository.manager, cartRepository.queryRunner);
    }

    addProductToCart() {
        
    }
    
}