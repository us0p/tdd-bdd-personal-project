import ProductEntity from "src/domain/product/product.entity"

export default interface IProductRepository {
	find: (id: number) => Promise<ProductEntity | undefined>
	findByName: (name: string) => Promise<ProductEntity[]>
	findByAvailability: (availability: boolean) => Promise<ProductEntity[]>
	findByCategory: (category: string) => Promise<ProductEntity[]>
	findByPrice: (price: number) => Promise<ProductEntity[]>
	create: (product: ProductEntity) => Promise<ProductEntity>
	update: (id: number, product: ProductEntity) => Promise<ProductEntity | undefined>
	delete: (id: number) => Promise<ProductEntity | undefined>
}
