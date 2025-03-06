import IProductRepository from "src/domain/interfaces/product.respository.interface";
import ProductDTO from "src/services/dto/product/product.dto";
import ProductEntityMapper from "src/services/helpers/mappers/product/product.mapper";

export default class FindAllProducts {
	private productRepo: IProductRepository

	constructor(repo: IProductRepository) {
		this.productRepo = repo
	}

	async exec(): Promise<ProductDTO[]> {
		const products = await this.productRepo.findAll()
		return products.map(p => ProductEntityMapper.toDto(p))
	}
}
