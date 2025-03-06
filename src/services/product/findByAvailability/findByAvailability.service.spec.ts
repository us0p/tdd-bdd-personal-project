import ProductEntityFake from "test/fakes/product.fake"
import FindProductByAvailabilityService from "./findByAvailability.service"
import ProductDTO from "src/services/dto/product/product.dto"
import ValidationError from "src/errors/validation/validation.error"

describe("Testing FindByAvailabilityService", () => {
	it("should throw an ValidationError if availability can't be converted to a boolean", async () => {
		const repo: any = {}
		const service = new FindProductByAvailabilityService(repo)
		expect(() => service.exec("asdf")).rejects.toThrow(ValidationError)
	})
	it("should return an empty array if there's no product with the specified availability", async () => {
		const repo: any = {
			findByAvailability: jest.fn(async (_) => [])
		}
		const service = new FindProductByAvailabilityService(repo)
		const products = await service.exec("true")
		expect(products).toStrictEqual([])
		expect(repo.findByAvailability.mock.calls).toHaveLength(1)
		expect(repo.findByAvailability.mock.calls[0][0]).toBe(true)
	})
	it("should return an array containing products witht the specified availability", async () => {
		const productBatch = ProductEntityFake.batch(10, true)
		const target = productBatch[0]
		const targetAvailabilityCount = productBatch.filter(p => p.available === target.available)

		const repo: any = {
			findByAvailability: jest.fn(async (_) => targetAvailabilityCount)
		}
		const service = new FindProductByAvailabilityService(repo)
		const products = await service.exec(`${target.available}`)
		expect(products).toMatchObject(targetAvailabilityCount)
		expect(repo.findByAvailability.mock.calls).toHaveLength(1)
		expect(repo.findByAvailability.mock.calls[0][0]).toBe(target.available)
		for (const product of products) {
			expect(product).toBeInstanceOf(ProductDTO)
		}
	})
})
