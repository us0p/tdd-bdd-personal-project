import ProductEntityFake from "test/fakes/product.fake"
import FindAllProducts from "./findAll.service"
import ProductDTO from "src/services/dto/product/product.dto"

describe("Testing FindAllProducts", () => {
	it("should return all products", async () => {
		const dbProducts = ProductEntityFake.batch(10, true)
		const repo: any = {
			findAll: jest.fn(() => dbProducts)
		}
		const service = new FindAllProducts(repo)
		const products = await service.exec()
		expect(products).toMatchObject(dbProducts)
		expect(products[0]).toBeInstanceOf(ProductDTO)
		expect(repo.findAll.mock.calls).toHaveLength(1)
		expect(repo.findAll.mock.calls[0]).toHaveLength(0)
	})
})
