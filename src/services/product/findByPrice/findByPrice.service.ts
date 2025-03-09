import IProductRepository from "src/domain/interfaces/product.respository.interface";
import ValidationError from "src/errors/validation/validation.error";
import ProductDTO from "src/services/dto/product/product.dto";
import ProductEntityMapper from "src/services/helpers/mappers/product/product.mapper";

export default class FindProductByPrice {
	private productRepo: IProductRepository

	constructor(repo: IProductRepository) {
		this.productRepo = repo
	}

	async exec(price: string): Promise<ProductDTO[]> {
		const floatPrice = parseFloat(price)
		if (isNaN(floatPrice)) throw new ValidationError("price must be a number")

		const products = await this.productRepo.findByPrice(floatPrice)

		return products.map(p => ProductEntityMapper.toDto(p))
	}
}
