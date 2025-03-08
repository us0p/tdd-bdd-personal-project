import ProductRepository from "./product.repository"
import DatabaseDAO from "../../db.database"
import ProductEntityFake from "test/fakes/product.fake"
import ProductEntity from "src/domain/product/product.entity"
import ProductDTO from "src/services/dto/product/product.dto"

describe("Testing ProductRepository", () => {
	it("should expect an instance of DatabaseDAO", () => {
		const db: any = {}
		const prepo = new ProductRepository(db)
		expect(prepo.dao).not.toBeUndefined()
	})
})

describe("Testing ProductRepository find methods", () => {
	const dbProducts = ProductEntityFake.batch(10, true)
	const target = dbProducts[0]
	const dao = {
		all: jest.fn((_, __) => dbProducts)
	}
	const prepo = new ProductRepository((dao as unknown as DatabaseDAO))

	it.each([
		{
			repoMethod: "findAll",
			sql: "SELECT * FROM product;",
			param: undefined,
			daoMethodParams: undefined
		},
		{
			repoMethod: "findByName",
			sql: "SELECT * FROM product WHERE name LIKE ?;",
			param: target.name,
			daoMethodParams: [target.name]
		},
		{
			repoMethod: "findByAvailability",
			sql: "SELECT * FROM product WHERE available = ?;",
			param: target.available,
			daoMethodParams: [target.available ? 1 : 0]
		},
		{
			repoMethod: "findByCategory",
			sql: "SELECT * FROM product WHERE category = ?;",
			param: target.category,
			daoMethodParams: [target.category],
		},
		{
			repoMethod: "findByPrice",
			sql: "SELECT * FROM product WHERE price = ?;",
			param: target.price,
			daoMethodParams: [target.price],
		},
	])("Testing ProductRepository.$repoMethod() method", async (testCase) => {
		const products = await prepo[testCase.repoMethod](testCase.param)
		expect(products).toMatchObject(dbProducts)
		expect(products[0]).toBeInstanceOf(ProductEntity)
		expect(dao.all.mock.calls).toHaveLength(1)
		expect(dao.all.mock.calls[0][0]).toBe(testCase.sql)
		expect(dao.all.mock.calls[0][1]).toStrictEqual(testCase.daoMethodParams)
		dao.all.mockClear()
	})
})

describe("Testing single row return methods", () => {
	const dbProduct = new ProductEntityFake(true)
	const dao = {
		get: jest.fn(async (_, __) => dbProduct)
	}
	const prepo = new ProductRepository((dao as unknown as DatabaseDAO))
	const productWithoutID = new ProductEntityFake()
	it.each([
		{
			repoMethod: "find",
			param: dbProduct.id!,
			sql: "SELECT * FROM product WHERE id = ?;",
			daoMethodParams: [dbProduct.id]
		},
		{
			repoMethod: "delete",
			param: dbProduct.id!,
			sql: "DELETE FROM product WHERE id = ? RETURNING *;",
			daoMethodParams: [dbProduct.id]
		},
		{
			repoMethod: "create",
			param: productWithoutID,
			sql: "INSERT INTO product (name, description, price, available, category) VALUES (?, ?, ?, ?, ?) RETURNING *;",
			daoMethodParams: [productWithoutID]
		},
	])("Testing ProductRepository.$repoMethod() method", async (testCase) => {
		const product = await prepo[testCase.repoMethod](testCase.param)
		expect(product).toMatchObject(dbProduct)
		expect(product).toBeInstanceOf(ProductEntity)
		expect(dao.get.mock.calls).toHaveLength(1)
		expect(dao.get.mock.calls[0][0]).toBe(testCase.sql)
		expect(dao.get.mock.calls[0][1]).toStrictEqual(testCase.daoMethodParams)
		dao.get.mockClear()
	})
})

describe("Testing ProductRepository.update() method", () => {
	it("should return a call to dao.get() method", async () => {
		const dbProduct = new ProductEntityFake(true)
		const dbProductUpdate = new ProductEntityFake(true)
		const expectedReturn = new ProductDTO(
			dbProductUpdate.name,
			dbProductUpdate.description,
			dbProductUpdate.price,
			dbProductUpdate.available,
			dbProductUpdate.category,
			dbProduct.id
		)
		const dao = {
			get: jest.fn(async (_, __) => expectedReturn)
		}
		const prepo = new ProductRepository((dao as unknown as DatabaseDAO))
		const product = await prepo.update(dbProduct.id!, dbProductUpdate)
		expect(product).toMatchObject(expectedReturn)
		expect(product).toBeInstanceOf(ProductEntity)
		expect(dao.get.mock.calls).toHaveLength(1)
		expect(dao.get.mock.calls[0][0]).toBe(
			"UPDATE SET name = ?, description = ?, price = ?, available = ?, category = ? FROM update WHERE id = ? RETURNING *;"
		)
		expect(dao.get.mock.calls[0][1]).toStrictEqual([
			dbProductUpdate.name,
			dbProductUpdate.description,
			dbProductUpdate.price,
			dbProductUpdate.available,
			dbProductUpdate.category,
			dbProduct.id
		])
	})
})
