import IProductRepository from "src/domain/interfaces/product.respository.interface";
import ProductDTO from "src/services/dto/product/product.dto";
import ProductEntityMapper from "src/services/helpers/mappers/product/product.mapper";
import { Injectable } from "@nestjs/common"

@Injectable()
export default class FindProductByNameService {
	private productRepo: IProductRepository

	constructor(repo: IProductRepository) {
		this.productRepo = repo
	}

	async exec(name: string): Promise<ProductDTO[]> {
		const products = await this.productRepo.findByName(name)
		return products.map(p => ProductEntityMapper.toDto(p))
	}
}
