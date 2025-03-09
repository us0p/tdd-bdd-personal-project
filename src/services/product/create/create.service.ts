import IProductRepository from "src/domain/interfaces/product.respository.interface";
import ProductDTO from "src/services/dto/product/product.dto";
import ProductEntityMapper from "src/services/helpers/mappers/product/product.mapper";

export default class CreateProductService {
	private productRepo: IProductRepository

	constructor(productRepo: IProductRepository) {
		this.productRepo = productRepo
	}

	async exec(product: ProductDTO): Promise<ProductDTO> {
		product.id = undefined
		const productEntity = ProductEntityMapper.fromDto(product)

		productEntity.validate()

		const dbEntity = await this.productRepo.create(productEntity)

		return ProductEntityMapper.toDto(dbEntity)
	}
}
