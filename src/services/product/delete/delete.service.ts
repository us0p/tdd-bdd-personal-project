import IProductRepository from "src/domain/interfaces/product.respository.interface";
import ProductEntity from "src/domain/product/product.entity";
import { Injectable } from '@nestjs/common';

@Injectable()
export default class DeleteProductService {
	private productRepo: IProductRepository

	constructor(repo: IProductRepository) {
		this.productRepo = repo
	}

	async exec(id: number): Promise<ProductEntity | undefined> {
		return this.productRepo.delete(id)
	}
}
