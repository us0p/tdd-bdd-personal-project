import IProductRepository from "src/domain/interfaces/product.respository.interface";
import DatabaseDAO from "../../db.database";
import ProductEntity from "src/domain/product/product.entity";
import ProductDTO from "src/services/dto/product/product.dto";
import ProductEntityMapper from "src/services/helpers/mappers/product/product.mapper";

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
		const products = await this.dao.all<ProductDTO>(
			"SELECT * FROM product WHERE available = ?;",
			[availability ? 1 : 0]
		)
		return products.map(p => ProductEntityMapper.fromDto(p))
	}
	async findByCategory(category: string): Promise<ProductEntity[]> {
		const products = await this.dao.all<ProductDTO>(
			"SELECT * FROM product WHERE category = ?;",
			[category]
		)
		return products.map(p => ProductEntityMapper.fromDto(p))
	}
	async findByPrice(price: number): Promise<ProductEntity[]> {
		const products = await this.dao.all<ProductDTO>(
			"SELECT * FROM product WHERE price = ?;",
			[price]
		)
		return products.map(p => ProductEntityMapper.fromDto(p))
	}
	async create(product: ProductEntity): Promise<ProductEntity> {
		const productDb = await this.dao.get<ProductDTO>(
			"INSERT INTO product (name, description, price, available, category) VALUES (?, ?, ?, ?, ?) RETURNING *;",
			[
				product.name,
				product.description,
				product.price,
				product.available,
				product.category
			]
		)
		return ProductEntityMapper.fromDto(productDb!)
	}
	async update(id: number, product: ProductEntity): Promise<ProductEntity | undefined> {
		const productDb = await this.dao.get<ProductDTO>(
			"UPDATE product SET name = ?, description = ?, price = ?, available = ?, category = ? WHERE id = ? RETURNING *;",
			[
				product.name,
				product.description,
				product.price,
				product.available,
				product.category,
				id
			]
		)
		if (productDb) return ProductEntityMapper.fromDto(productDb)
		return productDb
	}
	async delete(id: number): Promise<ProductEntity | undefined> {
		const product = await this.dao.get<ProductDTO | undefined>(
			"DELETE FROM product WHERE id = ? RETURNING *;",
			[id]
		)
		if (product) return ProductEntityMapper.fromDto(product)
		return product
	}
}
