import ProductDTO from "src/services/dto/product/product.dto"
import ProductEntityMapper from "./product.mapper"
import ProductEntityFake from "test/fakes/product.fake"
import ProductEntity from "src/domain/product/product.entity"

describe("Testing ProductMapper", () => {
	it("should yield a ProductEntity from a ProductDTO", () => {
		const product = new ProductEntityFake()
		const dto = new ProductDTO(
			product.name,
			product.description,
			product.price,
			product.available,
			product.category
		)
		const entity = ProductEntityMapper.fromDto(dto)
		expect(entity).toMatchObject(product)
		expect(entity).toBeInstanceOf(ProductEntity)
	})

	it("should yield a ProductDTO from a ProductEntity", () => {
		const entity = new ProductEntityFake()
		const dto = ProductEntityMapper.toDto(entity)
		expect(dto).toMatchObject({ ...entity })
		expect(dto).toBeInstanceOf(ProductDTO)
	})
})
