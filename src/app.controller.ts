import { Controller, Get, ParseBoolPipe, ParseFloatPipe, ParseIntPipe, Query } from '@nestjs/common';
import CreateProductService from './services/product/create/create.service';
import DeleteProductService from './services/product/delete/delete.service';
import UpdateProductService from './services/product/update/update.service';
import FindProductService from './services/product/find/find.service';
import FindProductByNameService from './services/product/findByName/findByName.service';
import FindProductByPrice from './services/product/findByPrice/findByPrice.service';
import FindProductByCategory from './services/product/fingByCategory/findByCategory.service';
import FindProductByAvailabilityService from './services/product/findByAvailability/findByAvailability.service';
import ProductDTO from './services/dto/product/product.dto';

@Controller("/products")
export class ProductController {
	constructor(
		private readonly createProductUsecase: CreateProductService,
		private readonly deleteProductUsecase: DeleteProductService,
		private readonly updateProductUsecase: UpdateProductService,
		private readonly findProductUsecase: FindProductService,
		private readonly findProductByNameUsecase: FindProductByNameService,
		private readonly findProductByPriceUsecase: FindProductByPrice,
		private readonly findProductByCategoryUsecase: FindProductByCategory,
		private readonly findProductByAvailabilityUsecase: FindProductByAvailabilityService,
		private readonly findProductsService: any
	) { }

	@Get()
	async findProducts(
		@Query('name') name: string,
		@Query('price') price: string,
		@Query('category') category: string,
		@Query('availability') available: string,
	): Promise<any> {
		let products: ProductDTO[];
		if (name) {
			products = await this.findProductByNameUsecase.exec(name)
		}
		else if (price) {
			products = await this.findProductByPriceUsecase.exec(price)
		}

		else if (category) {
			products = await this.findProductByCategoryUsecase.exec(category)
		}
		else if (available) {
			products = await this.findProductByAvailabilityUsecase.exec(available)
		}
		else {
			products = await this.findProductsService.exec()
		}

		return products
	}
}
