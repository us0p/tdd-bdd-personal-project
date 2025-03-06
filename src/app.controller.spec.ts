import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './app.controller';
import CreateProductService from './services/product/create/create.service';
import DeleteProductService from './services/product/delete/delete.service';
import UpdateProductService from './services/product/update/update.service';
import FindProductService from './services/product/find/find.service';
import FindProductByPrice from './services/product/findByPrice/findByPrice.service';
import FindProductByCategory from './services/product/fingByCategory/findByCategory.service';
import FindProductByNameService from './services/product/findByName/findByName.service';
import FindProductByAvailabilityService from './services/product/findByAvailability/findByAvailability.service';

//describe('Testing ProductController', () => {
//	let appController: ProductController;
//
//	//beforeEach(async () => {
//	//	const app: TestingModule = await Test.createTestingModule({
//	//		controllers: [ProductController],
//	//		providers: [
//	//			CreateProductService,
//	//			DeleteProductService,
//	//			UpdateProductService,
//	//			FindProductService,
//	//			FindProductByPrice,
//	//			FindProductByCategory,
//	//			FindProductByNameService,
//	//			FindProductByAvailabilityService
//	//		],
//	//	}).compile();
//
//	//	appController = app.get<ProductController>(ProductController);
//	//});
//
//	describe('root', () => {
//		//it('should return "Hello World!"', () => {
//		//	//expect(appController.findProducts()).toBe('Hello World!');
//		//});
//	});
//});
