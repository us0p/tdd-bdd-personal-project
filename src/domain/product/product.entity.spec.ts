import ValidationError from "src/errors/validation/validation.error"
import ProductEntity, { Category } from "./product.entity"
import ProductEntityFake from "test/fakes/product.fake"

describe("Testing enum Category", () => {
	it("should contain only the apropriate enums", () => {
		const categories = [
			"unknown",
			"cloths",
			"food",
			"housewares",
			"automotive",
			"tools"
		]
		for (const category of categories) {
			const categoryUpper = category.toUpperCase()
			expect(Category[categoryUpper]).toBe(categoryUpper)
		}
	})
})

describe("Testing product entity", () => {
	it.each([{
		payload: new ProductEntityFake(),
		message: "should return id as undefined"
	}, {
		payload: new ProductEntityFake(true),
		message: "should return id as 1"
	}
	])("$message", ({ payload }) => {
		const product = new ProductEntity(
			payload.name,
			payload.description,
			payload.price,
			payload.available,
			payload.category,
			payload.id,
		)
		expect(product).toMatchObject(payload)
	})
})

describe("Testing product validation", () => {
	it.each([
		// TESTING INVALID FORMAT
		{ key: "name", value: {} },
		{ key: "description", value: {} },
		{ key: "price", value: "asdf" },
		{ key: "available", value: "asdf" },
		// TESTING MISSING FIELDS
		{ key: "name", value: undefined },
		{ key: "description", value: undefined },
		{ key: "price", value: undefined },
		{ key: "available", value: undefined },
		{ key: "category", value: undefined },
		// TESTING INVALID VALUES
		{ key: "price", value: '-59.90' },
		{ key: "price", value: '0.0' },
	]
	)("validate $key with value $value", ({ key, value }) => {
		const product = new ProductEntityFake()
		product[key] = value
		expect(() => product.validate()).toThrow(ValidationError)
	})

	it("should return silently if all fields are present and in a valid format", () => {
		const product = new ProductEntityFake()
		expect(product.validate()).toStrictEqual(undefined)
	})
})
