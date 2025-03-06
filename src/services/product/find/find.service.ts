import IProductRepository from "src/domain/interfaces/product.respository.interface";
import ProductDTO from "src/services/dto/product/product.dto";
import ProductEntityMapper from "src/services/helpers/mappers/product/product.mapper";

export default class FindProductService {
	private productRepo: IProductRepository

	constructor(repo: IProductRepository) {
		this.productRepo = repo
	}

	async exec(id: number): Promise<ProductDTO | undefined> {
		const productEntity = await this.productRepo.find(id)
		if (productEntity) return ProductEntityMapper.toDto(productEntity)
		return undefined
	}
}
