import IProductRepository from "src/domain/interfaces/product.respository.interface";
import { Category } from "src/domain/product/product.entity";
import ValidationError from "src/errors/validation/validation.error";
import ProductDTO from "src/services/dto/product/product.dto";
import ProductEntityMapper from "src/services/helpers/mappers/product/product.mapper";

export default class FindProductByCategory {
	private productRepo: IProductRepository

	constructor(repo: IProductRepository) {
		this.productRepo = repo
	}

	async exec(category: string): Promise<ProductDTO[]> {
		const categoryEnum = Category[category.toUpperCase()]
		if (!categoryEnum) throw new ValidationError(`category ${category} isn't valid`)

		const products = await this.productRepo.findByCategory(categoryEnum)

		return products.map(p => ProductEntityMapper.toDto(p))
	}
}
