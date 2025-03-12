import ValidationError from "src/errors/validation/validation.error"

export enum Category {
	UNKNOWN = "UNKNOWN",
	CLOTHS = "CLOTHS",
	FOOD = "FOOD",
	HOUSEWARES = "HOUSEWARES",
	AUTOMOTIVE = "AUTOMOTIVE",
	TOOLS = "TOOLS",
}

export default class ProductEntity {
	name: string
	description: string
	price: number
	available: boolean
	category: Category
	id?: number

	constructor(
		name: string,
		description: string,
		price: string | number,
		available: boolean | string | number,
		category: string,
		id?: number
	) {
		this.name = name
		this.description = description
		this.available = ["true", "1"].includes(available?.toString())
		this.price = parseFloat(String(price))
		this.category = Category[category?.toUpperCase()]
		this.id = id
	}

	validate() {
		if (typeof this.name !== "string")
			throw new ValidationError("name is required")
		if (typeof this.description !== "string")
			throw new ValidationError("description is required")
		if (isNaN(this.price) || this.price <= 0)
			throw new ValidationError("price must be a positive number")
		if (typeof this.available !== "boolean")
			throw new ValidationError("available must be a boolean")
		if (typeof this.category !== "string")
			throw new ValidationError("category must be a valid Category value")
	}
}
