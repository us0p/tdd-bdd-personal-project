import { faker } from "@faker-js/faker"
import ProductEntity, { Category } from "src/domain/product/product.entity"

export default class ProductEntityFake extends ProductEntity {
	constructor(withId?: boolean) {
		super(
			faker.commerce.product(),
			faker.commerce.productDescription(),
			faker.commerce.price({ min: 0.0, max: 2000.0 }),
			faker.datatype.boolean(),
			faker.helpers.arrayElement([
				Category.TOOLS,
				Category.CLOTHS,
				Category.FOOD,
				Category.UNKNOWN,
				Category.AUTOMOTIVE,
				Category.HOUSEWARES
			]),
			withId ? faker.number.int({ min: 1, max: 10 }) : undefined
		)
	}

	static batch(size: number, withId?: boolean) {
		const products: ProductEntityFake[] = []
		for (let i = 0; i < size; i++) {
			products.push(new ProductEntityFake(withId))
		}
		return products
	}
}
