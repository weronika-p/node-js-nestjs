import { InjectRepository } from "@nestjs/typeorm";
import { OrderItemEntity } from "src/entities/order-item.entity";
import { Repository } from "typeorm"

export class OrderItemRepository extends Repository<OrderItemEntity> {
    constructor(
        @InjectRepository(OrderItemEntity)
        private orderItemRepository: Repository<OrderItemEntity>
    ) {
        super(orderItemRepository.target, orderItemRepository.manager, orderItemRepository.queryRunner);
    }

    
}