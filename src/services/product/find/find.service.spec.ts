import ProductEntityFake from "test/fakes/product.fake"
import FindProductService from "./find.service"
import ProductDTO from "src/services/dto/product/product.dto"

describe("Testing FindProductService", () => {
	it("should return undefined if the provided id doesn't exist", async () => {
		const repo: any = { find: jest.fn(async (_) => undefined) }
		const service = new FindProductService(repo)
		const product = await service.exec(0)
		expect(product).toBeUndefined()
		expect(repo.find.mock.calls).toHaveLength(1)
		expect(repo.find.mock.calls[0][0]).toBe(0)
	})
	it("should return the product with the provided ID", async () => {
		const repo: any = {
			find: jest.fn(async (id) => {
				const fake = new ProductEntityFake()
				fake.id = id
				return fake
			})
		}
		const service = new FindProductService(repo)
		const product = await service.exec(5)
		expect(product?.id).toBe(5)
		expect(product).toBeInstanceOf(ProductDTO)
		expect(repo.find.mock.calls).toHaveLength(1)
		expect(repo.find.mock.calls[0][0]).toBe(5)
	})
})
