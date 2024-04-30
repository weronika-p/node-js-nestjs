import { InjectRepository } from "@nestjs/typeorm";
import { ProductsEntity } from "src/entities/products.entity"
import { Product } from "src/models/product.model";
import { Repository } from "typeorm"

export class ProductsRepository extends Repository<ProductsEntity> {
    constructor(
        @InjectRepository(ProductsEntity)
        private productsRepository: Repository<ProductsEntity>
    ) {
        super(productsRepository.target, productsRepository.manager, productsRepository.queryRunner);
    }

    async createAndSave(product: Product) {
        let newProduct: Product;

        if (!product.id) {
            newProduct = this.productsRepository.create(product);
        }
        
        return await this.productsRepository.save(newProduct || product);
    }
}