import ProductEntityFake from "test/fakes/product.fake"
import APIResponseDTO from "src/interfaces/dto/api/api_response.dto"

import ProductController from "./product.controller"
import ProductEntityMapper from "src/services/helpers/mappers/product/product.mapper"

describe("Testing ProductController.find() method", () => {
	const dbProducts = ProductEntityFake.batch(10, true)
	const filterTarget = dbProducts[0]
	const prepo: any = {
		findAll: jest.fn(() => dbProducts),
		findByName: jest.fn(() => dbProducts.filter(p => p.name === filterTarget.name)),
		findByPrice: jest.fn(() => dbProducts.filter(p => p.price === filterTarget.price)),
		findByAvailability: jest.fn(() => dbProducts.filter(p => p.available === filterTarget.available)),
		findByCategory: jest.fn(() => dbProducts.filter(p => p.category === filterTarget.category))
	}

	afterEach(() => {
		prepo.findAll.mockClear()
		prepo.findByName.mockClear()
		prepo.findByPrice.mockClear()
		prepo.findByAvailability.mockClear()
		prepo.findByCategory.mockClear()
	})

	it.each([
		{ query: {}, expectedRepoMethodCalled: "findAll" },
		{ query: { name: "test" }, expectedRepoMethodCalled: "findByName" },
		{ query: { price: "59.90" }, expectedRepoMethodCalled: "findByPrice" },
		{ query: { available: "true" }, expectedRepoMethodCalled: "findByAvailability" },
		{ query: { category: "CLOTHS" }, expectedRepoMethodCalled: "findByCategory" },
	])("$expectedRepoMethodCalled() call", async (testCase) => {
		const pc = new ProductController(prepo)
		const apiResponse = await pc.find(testCase.query)
		expect(prepo[testCase.expectedRepoMethodCalled].mock.calls).toHaveLength(1)
		expect(apiResponse).toMatchObject({
			status: 200,
			data: prepo[testCase.expectedRepoMethodCalled].mock.results[0].value
		})
		expect(apiResponse).toBeInstanceOf(APIResponseDTO)
	})

	it.each([
		{ query: {}, expectedRepoMethodCalled: "findAll" },
		{ query: { name: "test" }, expectedRepoMethodCalled: "findByName" },
		{ query: { price: "59.90" }, expectedRepoMethodCalled: "findByPrice" },
		{ query: { available: "true" }, expectedRepoMethodCalled: "findByAvailability" },
		{ query: { category: "CLOTHS" }, expectedRepoMethodCalled: "findByCategory" },
	])("$expectedRepoMethoCalled() to fail with status 500", async (testCase) => {
		const pc = new ProductController(prepo);
		const mockMethod = prepo[testCase.expectedRepoMethodCalled] as jest.Mock
		mockMethod.mockRejectedValue(new Error("internal"));
		const apiResponse = await pc.find(testCase.query)
		expect(apiResponse).toMatchObject(APIResponseDTO.internalServerError())
		expect(apiResponse).toBeInstanceOf(APIResponseDTO)
		expect(mockMethod.mock.calls).toHaveLength(1)
	})
})

describe("Testing ProductController.delete() method", () => {
	const prepo: any = {
		delete: jest.fn(() => new ProductEntityFake(true))
	}
	const pc = new ProductController(prepo)

	afterEach(() => prepo.delete.mockClear())

	it("should delete the product and return a status 204 without body", async () => {
		const apiResponse = await pc.delete(1)
		expect(apiResponse).toBeInstanceOf(APIResponseDTO)
		expect(apiResponse).toMatchObject({ status: 204 })
	})

	it("should fail with status 500 if any error occur", async () => {
		prepo.delete.mockRejectedValue(new Error("internal"))
		const apiResponse = await pc.delete(1)
		expect(apiResponse).toBeInstanceOf(APIResponseDTO)
		expect(apiResponse).toMatchObject(APIResponseDTO.internalServerError())
	})

	it("should return status 404 if id doesn't exist", async () => {
		const prepo: any = {
			delete: jest.fn(() => undefined)
		}
		const pc = new ProductController(prepo)
		const apiResponse = await pc.delete(1)
		expect(apiResponse).toBeInstanceOf(APIResponseDTO)
		expect(apiResponse).toMatchObject({
			status: 404,
			data: { message: "product with id 1 doesn't exist" }
		})
		expect(prepo.delete.mock.calls).toHaveLength(1)
	})
})

describe("Testing ProductController.create() method", () => {
	it("should return status 409 for invalid product data", async () => {
		const repo: any = {
			create: jest.fn()
		}
		const pc = new ProductController(repo)
		const fakeData = ProductEntityMapper.toDto(new ProductEntityFake())
		fakeData.price = "asdf"
		const apiResponse = await pc.create(fakeData)
		expect(apiResponse).toBeInstanceOf(APIResponseDTO)
		expect(apiResponse).toMatchObject({
			status: 409,
			data: { message: "price must be a positive number" }
		})
		expect(repo.create.mock.calls).toHaveLength(0)
	})

	it("should return status 500 for internal errors", async () => {
		const repo: any = {
			create: jest.fn(() => { throw new Error("internal") })
		}
		const pc = new ProductController(repo)
		const apiResponse = await pc.create(ProductEntityMapper.toDto(new ProductEntityFake()))
		expect(apiResponse).toBeInstanceOf(APIResponseDTO)
		expect(apiResponse).toMatchObject(APIResponseDTO.internalServerError())
		expect(repo.create.mock.calls).toHaveLength(1)
	})

	it("should return status 201 for created products with the created product details", async () => {
		const fake = new ProductEntityFake()
		const repo: any = {
			create: jest.fn(() => {
				fake.id = 1
				return fake
			})
		}
		const pc = new ProductController(repo)
		const apiResponse = await pc.create(ProductEntityMapper.toDto(fake))
		expect(apiResponse).toBeInstanceOf(APIResponseDTO)
		expect(apiResponse).toMatchObject({
			status: 201,
			data: { ...fake, id: 1 }
		})
		expect(repo.create.mock.calls).toHaveLength(1)
	})
})

describe("Testing ProductController.update() method", () => {
	it("should return status 409 for invalid product data", async () => {
		const prepo: any = {
			update: jest.fn()
		}
		const pc = new ProductController(prepo)
		const fake = ProductEntityMapper.toDto(new ProductEntityFake())
		fake.price = "asdf"
		const apiResponse = await pc.update(1, fake)
		expect(apiResponse).toBeInstanceOf(APIResponseDTO)
		expect(apiResponse).toMatchObject({
			status: 409,
			data: { message: "price must be a positive number" }
		})
		expect(prepo.update.mock.calls).toHaveLength(0)
	})

	it("should return status 404 if id doesn't exist", async () => {
		const prepo: any = {
			update: jest.fn(() => undefined)
		}
		const pc = new ProductController(prepo)
		const fake = ProductEntityMapper.toDto(new ProductEntityFake())
		const apiResponse = await pc.update(1, fake)
		expect(apiResponse).toBeInstanceOf(APIResponseDTO)
		expect(apiResponse).toMatchObject({
			status: 404,
			data: { message: "product with id 1 doesn't exist" }
		})
		expect(prepo.update.mock.calls).toHaveLength(1)
	})

	it("should return status 500 for internal errors", async () => {
		const prepo: any = {
			update: jest.fn(() => { throw new Error("internal") })
		}
		const pc = new ProductController(prepo)
		const fake = ProductEntityMapper.toDto(new ProductEntityFake())
		const apiResponse = await pc.update(1, fake)
		expect(apiResponse).toBeInstanceOf(APIResponseDTO)
		expect(apiResponse).toMatchObject(APIResponseDTO.internalServerError())
		expect(prepo.update.mock.calls).toHaveLength(1)
	})

	it("should return status 200 and updated product", async () => {
		const fake = new ProductEntityFake()
		fake.id = 1
		const prepo: any = {
			update: jest.fn(() => fake)
		}
		const pc = new ProductController(prepo)
		const apiResponse = await pc.update(1, ProductEntityMapper.toDto(fake))
		expect(apiResponse).toBeInstanceOf(APIResponseDTO)
		expect(apiResponse).toMatchObject({
			status: 200,
			data: fake
		})
		expect(prepo.update.mock.calls).toHaveLength(1)
	})
})

describe("Testing ProductController.get() method", () => {
	it("should return status 404 if id doesn't exist", async () => {
		const prepo: any = {
			find: jest.fn(() => undefined)
		}
		const pc = new ProductController(prepo)
		const apiResponse = await pc.get(1)
		expect(apiResponse).toBeInstanceOf(APIResponseDTO)
		expect(apiResponse).toMatchObject({
			status: 404,
			data: { message: "product with id 1 doesn't exist" }
		})
		expect(prepo.find.mock.calls).toHaveLength(1)
	})

	it("should return status 500 if any internal error occurs", async () => {
		const prepo: any = {
			find: jest.fn(() => { throw new Error("internal") })
		}
		const pc = new ProductController(prepo)
		const apiResponse = await pc.get(1)
		expect(apiResponse).toBeInstanceOf(APIResponseDTO)
		expect(apiResponse).toMatchObject(APIResponseDTO.internalServerError())
		expect(prepo.find.mock.calls).toHaveLength(1)
	})

	it("should return status 200 and product details", async () => {
		const fake = new ProductEntityFake()
		fake.id = 1
		const prepo: any = {
			find: jest.fn(() => fake)
		}
		const pc = new ProductController(prepo)
		const apiResponse = await pc.get(1)
		expect(apiResponse).toBeInstanceOf(APIResponseDTO)
		expect(apiResponse).toMatchObject({
			status: 200,
			data: fake
		})
		expect(prepo.find.mock.calls).toHaveLength(1)
	})
})
