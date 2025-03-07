import IProductRepository from "src/domain/interfaces/product.respository.interface";
import DatabaseDAO from "../../db.database";
import ProductEntity from "src/domain/product/product.entity";
import ProductDTO from "src/services/dto/product/product.dto";
import ProductEntityMapper from "src/services/helpers/mappers/product/product.mapper";
import ProductEntityFake from "test/fakes/product.fake";

export default class ProductRepository implements IProductRepository {
	dao: DatabaseDAO

	constructor(db: DatabaseDAO) {
		this.dao = db
	}

	async findAll(): Promise<ProductEntity[]> {
		const products = await this.dao.all<ProductDTO>("SELECT * FROM product;")
		return products.map(p => ProductEntityMapper.fromDto(p))
	}

	async find(id: number): Promise<ProductEntity | undefined> {
		const product = await this.dao.get<ProductDTO>("SELECT * FROM product WHERE id = ?;", [id])
		if (product) return ProductEntityMapper.fromDto(product)
		return product
	}

	async findByName(name: string): Promise<ProductEntity[]> {
		const products = await this.dao.all<ProductDTO>("SELECT * FROM product WHERE name LIKE ?;", [name])
		return products.map(p => ProductEntityMapper.fromDto(p))
	}
	async findByAvailability(availability: boolean): Promise<ProductEntity[]> {
		return []
	}
	async findByCategory(category: string): Promise<ProductEntity[]> {
		return []
	}
	async findByPrice(price: number): Promise<ProductEntity[]> {
		return []
	}
	async create(product: ProductEntity): Promise<ProductEntity> {
		return new ProductEntityFake()
	}
	async update(id: number, product: ProductEntity): Promise<ProductEntity | undefined> {
		return undefined
	}
	async delete(id: number): Promise<ProductEntity | undefined> {
		return undefined
	}
}
