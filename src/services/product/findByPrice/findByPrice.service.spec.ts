import ValidationError from "src/errors/validation/validation.error"
import FindProductByPrice from "./findByPrice.service"
import ProductEntityFake from "test/fakes/product.fake"

describe("Testing FindProductByPrice", () => {
	it("should throw an ValidationError if price isNaN", async () => {
		const repo: any = {}
		const service = new FindProductByPrice(repo)
		expect(() => service.exec("asdf")).rejects.toThrow(ValidationError)
	})
	it("should return an empty array if price doesn't exist", async () => {
		const repo: any = {
			findByPrice: jest.fn(async (_) => [])
		}
		const service = new FindProductByPrice(repo)
		const products = await service.exec("50")
		expect(products).toStrictEqual([])
		expect(repo.findByPrice.mock.calls).toHaveLength(1)
		expect(repo.findByPrice.mock.calls[0][0]).toBe(50)
	})
	it("should return an array of products with matching price", async () => {
		const batch = ProductEntityFake.batch(10, true)
		const target = batch[0]
		const targetPrice = target.price
		const productsMatchingPrice = batch.filter(p => p.price === targetPrice)

		const repo: any = {
			findByPrice: jest.fn(async (_) => productsMatchingPrice)
		}
		const service = new FindProductByPrice(repo)
		const products = await service.exec(`${targetPrice}`)
		expect(products).toMatchObject(productsMatchingPrice)
		expect(repo.findByPrice.mock.calls).toHaveLength(1)
		expect(repo.findByPrice.mock.calls[0][0]).toBe(targetPrice)
	})
})
