import ProductDTO from "./product.dto"

describe("Testing ProductDTO", () => {
	it("should contain all the fields of a product", () => {
		const pdto = new ProductDTO(
			"Car",
			"A very expensive car",
			999999.99,
			true,
			"AUTOMOTIVE"
		)
		expect(pdto).toMatchObject({
			name: "Car",
			description: "A very expensive car",
			price: 999999.99,
			available: true,
			category: "AUTOMOTIVE",
			id: undefined
		})
	})
})
