import ProductEntityFake from "test/fakes/product.fake"
import CreateProductService from "./create.service"
import ValidationError from "src/errors/validation/validation.error"
import ProductEntity from "src/domain/product/product.entity"
import ProductEntityMapper from "src/services/helpers/mappers/product/product.mapper"
import ProductDTO from "src/services/dto/product/product.dto"
import IProductRepository from "src/domain/interfaces/product.respository.interface"

describe("Testing CreateProductService", () => {
	const repo = {
		create: jest.fn(async (pe: ProductEntity) => new ProductEntity(
			pe.name,
			pe.description,
			pe.price,
			pe.available,
			pe.category,
			1
		))
	}

	afterEach(() => {
		repo.create.mockClear()
	})

	it("should throw a ValidationError if provided data is invalid", async () => {
		const repo: any = {}
		const service = new CreateProductService(repo)
		const product = new ProductEntityFake()
		product.price = -50.0
		await expect(() => service.exec({ ...product })).rejects.toThrow(ValidationError)
	})

	it("should call respository create method and return its return value", async () => {
		const service = new CreateProductService(repo as unknown as IProductRepository)
		const product = new ProductEntityFake()
		const productEntity = await service.exec(ProductEntityMapper.toDto(product))

		expect(productEntity).toBeInstanceOf(ProductDTO)
		expect(productEntity).toMatchObject({ ...product, id: 1 })
		expect(repo.create.mock.calls).toHaveLength(1)
		expect(repo.create.mock.calls[0][0]).toMatchObject(product)
	})

	it("should not be possible to create a product by providing an id", async () => {
		const service = new CreateProductService(repo as unknown as IProductRepository)
		const product = new ProductEntityFake()
		product.id = 0
		const productDTO = await service.exec(ProductEntityMapper.toDto(product))
		expect(productDTO).toBeInstanceOf(ProductDTO)
		expect(productDTO).toMatchObject({ ...product, id: 1 })
		expect(repo.create.mock.calls).toHaveLength(1)
		expect(repo.create.mock.calls[0][0].id).toBeUndefined()
	})
})
