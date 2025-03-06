import ValidationError from "src/errors/validation/validation.error"
import FindProductByCategory from "./findByCategory.service"
import { Category } from "src/domain/product/product.entity"
import ProductEntityFake from "test/fakes/product.fake"
import ProductDTO from "src/services/dto/product/product.dto"

describe("Testing FindProductByCategory", () => {
	it("should throw a ValidationError if provided category is invalid", async () => {
		const repo: any = {}
		const service = new FindProductByCategory(repo)
		expect(() => service.exec("asdf")).rejects.toThrow(ValidationError)
	})
	it("should return an empty array if category isn't present", async () => {
		const repo: any = {
			findByCategory: jest.fn(async (_) => [])
		}
		const service = new FindProductByCategory(repo)
		const products = await service.exec(Category.CLOTHS)
		expect(products).toStrictEqual([])
		expect(repo.findByCategory.mock.calls).toHaveLength(1)
		expect(repo.findByCategory.mock.calls[0][0]).toBe(Category.CLOTHS)
	})

	it("should return an array with all matching categories", async () => {
		const batch = ProductEntityFake.batch(10, true)
		const target = batch[0]
		const targetCategory = target.category
		const matchingCategory = batch.filter(p => p.category === targetCategory)

		const repo: any = {
			findByCategory: jest.fn(async (_) => matchingCategory)
		}
		const service = new FindProductByCategory(repo)
		const products = await service.exec(targetCategory)
		expect(products).toMatchObject(matchingCategory)
		expect(products[0]).toBeInstanceOf(ProductDTO)
		expect(repo.findByCategory.mock.calls).toHaveLength(1)
		expect(repo.findByCategory.mock.calls[0][0]).toBe(targetCategory)
	})
})
