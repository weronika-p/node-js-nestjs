import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ProductsEntity } from 'src/entities/products.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Product } from 'src/models/product.model';
import { ProductsRepository } from 'src/repositories/products.repository';
import { deleteFile } from 'src/util/file';

@Injectable()
export class AdminService {
  products: Product[] = []
  ITEMS_PER_PAGE: number = 1

  constructor(private productsRepository: ProductsRepository) {}

  async save(product: Product): Promise<ProductsEntity> {
    return await this.productsRepository.createAndSave(product)
  }

  async deleteById(product: any): Promise<void> {
    try {
      const productToBeDeleted = await this.productsRepository.findOneBy({
        id: product,
      })
      if (!productToBeDeleted) {
        throw new NotFoundException(`Product with ID "${product}" not found`)
      }
      deleteFile(productToBeDeleted.imageUrl)
      const result = await this.productsRepository.delete(product)

      if (result.affected === 0) {
        throw new NotFoundException(`Product with ID "${product}" not found`)
      }
    } catch (error) {
      throw new HttpException(
        error?.message || 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async fetchAll(
    page?: number,
  ): Promise<{
    numProducts: number
    products: ProductsEntity[]
    hasNextPage: boolean
    lastPage: number
    canLastPageBeDisplayed: boolean
    isNotFirstPage: boolean
  }> {
    const numProducts = await this.productsRepository.count()
    const skippedItems = (page - 1) * this.ITEMS_PER_PAGE
    const products = await this.productsRepository.find({
      skip: skippedItems || 0,
      take: this.ITEMS_PER_PAGE,
    })
    const hasNextPage = this.ITEMS_PER_PAGE * page < numProducts
    const lastPage = Math.ceil(numProducts / this.ITEMS_PER_PAGE)
    const canLastPageBeDisplayed = lastPage !== page && lastPage !== page + 1
    const isNotFirstPage = page !== 1 && page - 1 !== 1
    return {
      numProducts,
      products,
      hasNextPage,
      lastPage,
      canLastPageBeDisplayed,
      isNotFirstPage,
    }
  }

  async findById(id: string): Promise<ProductsEntity> {
    const foundProduct = await this.productsRepository.findOneBy({ id: id })

    if (!foundProduct) {
      throw new NotFoundException(`Product with ID "${id}" not found`)
    }

    return foundProduct
  }

  async getProductToEdit(id: string, user: UserEntity) {
    const selectedProduct = await this.productsRepository.findOne({
      where: { id, user },
    })

    if (!selectedProduct) {
      throw new NotFoundException(`Task with ID "${id}" not found`)
    }

    return selectedProduct
  }

  async fetchAllProductsByUser(user: UserEntity) {
    return await this.productsRepository.find({ where: { user: user } })
  }
}
