import ProductRepository from "./product.repository"
import DatabaseDAO from "../../db.database"
import ProductEntityFake from "test/fakes/product.fake"
import ProductEntity from "src/domain/product/product.entity"

describe("Testing ProductRepository", () => {
	it("should expect an instance of DatabaseDAO", () => {
		const db: any = {}
		const prepo = new ProductRepository(db)
		expect(prepo.dao).not.toBeUndefined()
	})
})

describe("Testing ProductRepository.all() method", () => {
	it("should return a call to dao.all()", async () => {
		const dbProducts = ProductEntityFake.batch(10, true)
		const dao = {
			all: jest.fn(async (_, __) => dbProducts),
		}
		const prepo = new ProductRepository((dao as unknown as DatabaseDAO))
		const products = await prepo.findAll()
		expect(products).toMatchObject(dbProducts)
		expect(products[0]).toBeInstanceOf(ProductEntity)
		expect(dao.all.mock.calls).toHaveLength(1)
		expect(dao.all.mock.calls[0][0]).toBe("SELECT * FROM product;")
	})
})

describe("Testing ProductRepository.get() method", () => {
	it("should return a call to dao.get()", async () => {
		const dbProduct = new ProductEntityFake(true)
		const dao = {
			get: jest.fn(async (_, __) => dbProduct)
		}
		const prepo = new ProductRepository((dao as unknown as DatabaseDAO))
		const product = await prepo.find(dbProduct.id!)
		expect(product).toMatchObject(dbProduct)
		expect(product).toBeInstanceOf(ProductEntity)
		expect(dao.get.mock.calls).toHaveLength(1)
		expect(dao.get.mock.calls[0][0]).toBe("SELECT * FROM product WHERE id = ?;")
		expect(dao.get.mock.calls[0][1]).toStrictEqual([dbProduct.id!])
	})
})

describe("Testing ProductRepository.findByName() method", () => {
	it("should return a call to dao.all() filtering products by name", async () => {
		const dbProducts = ProductEntityFake.batch(10, true)
		const dao = {
			all: jest.fn((_, __) => dbProducts)
		}
		const target = dbProducts[0]
		const targetName = target.name
		const prepo = new ProductRepository((dao as unknown as DatabaseDAO))
		const products = await prepo.findByName(targetName)
		expect(products).toMatchObject(dbProducts)
		expect(products[0]).toBeInstanceOf(ProductEntity)
		expect(dao.all.mock.calls).toHaveLength(1)
		expect(dao.all.mock.calls[0][0]).toBe("SELECT * FROM product WHERE name LIKE ?;")
		expect(dao.all.mock.calls[0][1]).toStrictEqual([targetName])
	})
})
