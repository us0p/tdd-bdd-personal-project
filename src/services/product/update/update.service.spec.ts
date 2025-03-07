import ProductEntityFake from "test/fakes/product.fake"
import UpdateProductService from "./update.service"
import ValidationError from "src/errors/validation/validation.error"
import ProductEntity from "src/domain/product/product.entity"
import ProductEntityMapper from "src/services/helpers/mappers/product/product.mapper"
import ProductDTO from "src/services/dto/product/product.dto"

describe("Testing UpdateProductService", () => {
	it("should perform validation on the product data received", async () => {
		const product = new ProductEntityFake()
		product.price = 0
		const productDto = ProductEntityMapper.toDto(product)
		const repo: any = {}
		const service = new UpdateProductService(repo)
		await expect(() => service.exec(1, productDto)).rejects.toThrow(ValidationError)
	})
	it("should not be possible to update the ID of a product", async () => {
		const repo: any = {
			update: jest.fn(async (id, product) => new ProductEntity(
				product.name,
				product.description,
				product.price,
				product.available,
				product.category,
				id
			))
		}
		const product = new ProductEntityFake()
		product.id = 2
		const service = new UpdateProductService(repo)
		const productDto = ProductEntityMapper.toDto(product)
		const queryID = 1
		const updatedProduct = await service.exec(queryID, productDto)
		expect(updatedProduct).toMatchObject({ ...product, id: queryID })
		expect(updatedProduct).toBeInstanceOf(ProductDTO)
		expect(repo.update.mock.calls).toHaveLength(1)
		expect(repo.update.mock.calls[0][0]).toBe(1)
		expect(repo.update.mock.calls[0][1]).toMatchObject({ ...product, id: queryID })

	})
	it("should make a call to repository update method and return its value", async () => {
		const repo: any = {
			update: jest.fn(async (id, product) => new ProductEntity(
				product.name,
				product.description,
				product.price,
				product.available,
				product.category,
				id
			))
		}
		const product = new ProductEntityFake()
		const productDto = ProductEntityMapper.toDto(product)
		const service = new UpdateProductService(repo)
		const queryID = 1
		const updatedProduct = await service.exec(queryID, productDto)
		expect(updatedProduct).toMatchObject({ ...product, id: queryID })
		expect(updatedProduct).toBeInstanceOf(ProductDTO)
		expect(repo.update.mock.calls).toHaveLength(1)
		expect(repo.update.mock.calls[0][0]).toBe(1)
		expect(repo.update.mock.calls[0][1]).toMatchObject({ ...product, id: queryID })
	})
})
