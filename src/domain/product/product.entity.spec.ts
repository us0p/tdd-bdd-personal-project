import ValidationError from "src/errors/validation/validation.error"
import ProductEntity, { Category } from "./product.entity"
import ProductEntityFake from "test/fakes/product.fake"
import ProductDTO from "src/services/dto/product/product.dto"

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
	}, {
		payload: {} as ProductDTO,
		message: "should return an entity with all fields as undefined"
	}])("$message", ({ payload }) => {
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

	it.each([
		{
			available: "true",
			match: true,
			message: "should convert string 'true' to boolean true",
		},
		{
			available: true,
			match: true,
			message: "should accept boolean true as valid entry"
		},
		{
			available: 1,
			match: true,
			message: "should accept integer 1 as a valid true entry"
		},
		{
			available: "asdf",
			match: false,
			message: "should convert any other value to false"
		}])("$message", ({ available, match }) => {
			const productFake = new ProductEntityFake()
			const productWithDirectUserInput = new ProductEntity(
				productFake.name,
				productFake.description,
				productFake.price,
				available,
				productFake.category
			)
			expect(productWithDirectUserInput.available).toBe(match)
		})
})

describe("Testing product validation", () => {
	it.each([
		// TESTING INVALID FORMAT
		{ key: "name", value: {} },
		{ key: "description", value: {} },
		{ key: "price", value: "asdf" },
		// TESTING MISSING FIELDS
		{ key: "name", value: undefined },
		{ key: "description", value: undefined },
		{ key: "price", value: undefined },
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
