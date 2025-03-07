import IProductRepository from "src/domain/interfaces/product.respository.interface";
import ProductDTO from "src/services/dto/product/product.dto";
import ProductEntityMapper from "src/services/helpers/mappers/product/product.mapper";
import { Injectable } from "@nestjs/common"

@Injectable()
export default class UpdateProductService {
	private productRepo: IProductRepository

	constructor(repo: IProductRepository) {
		this.productRepo = repo
	}

	async exec(id: number, product: ProductDTO): Promise<ProductDTO | undefined> {
		const entity = ProductEntityMapper.fromDto(product)
		entity.id = id

		entity.validate()

		const dbEntity = await this.productRepo.update(id, entity)

		if (dbEntity) return ProductEntityMapper.toDto(dbEntity)
		return undefined
	}
}
