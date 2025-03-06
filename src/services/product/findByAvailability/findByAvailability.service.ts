import IProductRepository from "src/domain/interfaces/product.respository.interface";
import ValidationError from "src/errors/validation/validation.error";
import ProductDTO from "src/services/dto/product/product.dto";
import ProductEntityMapper from "src/services/helpers/mappers/product/product.mapper";
import { Injectable } from '@nestjs/common';

@Injectable()
export default class FindProductByAvailabilityService {
	private productRepo: IProductRepository

	constructor(repo: IProductRepository) {
		this.productRepo = repo
	}

	async exec(availabe: string): Promise<ProductDTO[]> {
		const isBoolean = ["true", "false"].includes(availabe.toLowerCase())
		if (!isBoolean) throw new ValidationError("available must be 'true' or 'false'")
		const availableAsBoolean = availabe.toLowerCase() === "true"
		const products = await this.productRepo.findByAvailability(availableAsBoolean)
		return products.map(p => ProductEntityMapper.toDto(p))
	}
}
