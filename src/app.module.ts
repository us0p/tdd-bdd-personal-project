import { DynamicModule, Module } from '@nestjs/common';
import { ProductController } from './app.controller';
import CreateProductService from './services/product/create/create.service';
import DeleteProductService from './services/product/delete/delete.service';
import UpdateProductService from './services/product/update/update.service';
import FindProductService from './services/product/find/find.service';
import FindProductByPrice from './services/product/findByPrice/findByPrice.service';
import FindProductByCategory from './services/product/fingByCategory/findByCategory.service';
import FindProductByNameService from './services/product/findByName/findByName.service';
import FindProductByAvailabilityService from './services/product/findByAvailability/findByAvailability.service';
import FindAllProducts from './services/product/findAll/findAll.service';

@Module({
	imports: [],
	controllers: [ProductController],
	providers: [
		CreateProductService,
		DeleteProductService,
		UpdateProductService,
		FindAllProducts,
		FindProductService,
		FindProductByPrice,
		FindProductByCategory,
		FindProductByNameService,
		FindProductByAvailabilityService
	],
})
export class AppModule {
	static forRoot(): DynamicModule {
		const providers = [
		]

		return {
			module: AppModule,
			providers,
		}
	}
}
