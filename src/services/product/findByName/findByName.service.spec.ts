import ProductEntityFake from "test/fakes/product.fake"
import FindProductByNameService from "./findByName.service"

describe("Testing FindProductByNameService", () => {
	it("should return an empty array if provided name doesn't exist", async () => {
		const repo: any = {
			findByName: jest.fn(async (_) => [])
		}
		const service = new FindProductByNameService(repo)
		const products = await service.exec("test")
		expect(products).toStrictEqual([])
		expect(repo.findByName.mock.calls).toHaveLength(1)
		expect(repo.findByName.mock.calls[0][0]).toBe("test")
	})
	it("should return an array of product dtos that match the provided name", async () => {
		const product = ProductEntityFake.batch(10, true)
		const target = product[0]
		const targetName = target.name
		const matchedProducts = product.filter(p => p.name.includes(targetName))

		const repo: any = {
			findByName: jest.fn(async (_) => matchedProducts)
		}
		const service = new FindProductByNameService(repo)
		const productsArray = await service.exec(targetName)
		expect(productsArray).toMatchObject(matchedProducts)
		expect(repo.findByName.mock.calls).toHaveLength(1)
		expect(repo.findByName.mock.calls[0][0]).toBe(targetName)
	})
})
