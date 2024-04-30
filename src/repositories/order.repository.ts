import { InjectRepository } from "@nestjs/typeorm";
import { CartEntity } from "src/entities/cart.entity";
import { OrderEntity } from "src/entities/order.entity";
import { Repository } from "typeorm"

export class OrderRepository extends Repository<OrderEntity> {
    constructor(
        @InjectRepository(OrderEntity)
        private orderRepository: Repository<OrderEntity>
    ) {
        super(orderRepository.target, orderRepository.manager, orderRepository.queryRunner);
    }
    
}