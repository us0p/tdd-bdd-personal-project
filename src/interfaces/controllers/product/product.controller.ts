import IProductRepository from "src/domain/interfaces/product.respository.interface";
import ValidationError from "src/errors/validation/validation.error";
import APIResponseDTO from "src/interfaces/dto/api/api_response.dto";
import ProductDTO from "src/services/dto/product/product.dto";
import CreateProductService from "src/services/product/create/create.service";
import DeleteProductService from "src/services/product/delete/delete.service";
import FindProductService from "src/services/product/find/find.service";
import FindAllProducts from "src/services/product/findAll/findAll.service";
import FindProductByAvailabilityService from "src/services/product/findByAvailability/findByAvailability.service";
import FindProductByNameService from "src/services/product/findByName/findByName.service";
import FindProductByPrice from "src/services/product/findByPrice/findByPrice.service";
import FindProductByCategory from "src/services/product/fingByCategory/findByCategory.service";
import UpdateProductService from "src/services/product/update/update.service";

export default class ProductController {
	private prepo: IProductRepository

	constructor(repo: IProductRepository) {
		this.prepo = repo
	}

	async find(
		query: {
			name?: string,
			price?: string,
			available?: string,
			category?: string
		}
	): Promise<APIResponseDTO> {
		let products: ProductDTO[]
		try {
			if (query.name) {
				products = await (new FindProductByNameService(this.prepo).exec(query.name))
			} else if (query.price) {
				products = await (new FindProductByPrice(this.prepo).exec(query.price))
			} else if (query.available) {
				products = await (new FindProductByAvailabilityService(this.prepo).exec(query.available))
			} else if (query.category) {
				products = await (new FindProductByCategory(this.prepo).exec(query.category))
			} else {
				products = await (new FindAllProducts(this.prepo).exec())
			}

			return new APIResponseDTO(200, products)
		} catch (e) {
			return APIResponseDTO.internalServerError()
		}
	}

	async get(id: number): Promise<APIResponseDTO> {
		const findService = new FindProductService(this.prepo)
		try {
			const product = await findService.exec(id)
			if (!product) return new APIResponseDTO(404, { message: `product with id ${id} doesn't exist` })
			return new APIResponseDTO(200, product)
		} catch (e) {
			return APIResponseDTO.internalServerError()
		}
	}

	async delete(id: number): Promise<APIResponseDTO> {
		const deleteService = new DeleteProductService(this.prepo)
		try {
			const deletedProduct = await deleteService.exec(id)
			if (!deletedProduct)
				return new APIResponseDTO(404, { message: `product with id ${id} doesn't exist` })
			return new APIResponseDTO(204)
		} catch (e) {
			return APIResponseDTO.internalServerError()
		}
	}

	async create(product: ProductDTO): Promise<APIResponseDTO> {
		const createService = new CreateProductService(this.prepo)
		try {
			const newProduct = await createService.exec(product)
			return new APIResponseDTO(201, newProduct)
		} catch (e) {
			if (e instanceof ValidationError) return new APIResponseDTO(409, { message: e.message })
			return APIResponseDTO.internalServerError()
		}
	}

	async update(id: number, product: ProductDTO): Promise<APIResponseDTO> {
		const updateService = new UpdateProductService(this.prepo)
		try {
			const updatedProduct = await updateService.exec(id, product)
			if (!updatedProduct)
				return new APIResponseDTO(404, { message: `product with id ${id} doesn't exist` })
			return new APIResponseDTO(200, updatedProduct)
		} catch (e) {
			if (e instanceof ValidationError) return new APIResponseDTO(409, { message: e.message })
			return APIResponseDTO.internalServerError()
		}
	}
}
