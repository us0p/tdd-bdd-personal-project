import ProductEntity from "src/domain/product/product.entity";
import ProductDTO from "src/services/dto/product/product.dto";

export default class ProductEntityMapper {
	static fromDto(dto: ProductDTO): ProductEntity {
		return new ProductEntity(
			dto.name,
			dto.description,
			dto.price,
			dto.available,
			dto.category
		)
	}

	static toDto(entity: ProductEntity): ProductDTO {
		return new ProductDTO(
			entity.name,
			entity.description,
			entity.price,
			entity.available,
			entity.category,
			entity.id
		)
	}
}
