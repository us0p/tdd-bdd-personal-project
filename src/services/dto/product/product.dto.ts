export default class ProductDTO {
	name: string
	description: string
	price: string | number
	available: boolean
	category: string
	id?: number

	constructor(
		name: string,
		description: string,
		price: string | number,
		available: boolean,
		category: string,
		id?: number
	) {
		this.name = name
		this.description = description
		this.price = price
		this.available = available
		this.category = category
		this.id = id
	}
}
