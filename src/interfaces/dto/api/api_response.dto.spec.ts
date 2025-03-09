import ProductEntityMapper from "src/services/helpers/mappers/product/product.mapper"
import ProductEntityFake from "test/fakes/product.fake"

import APIResponseDTO from "./api_response.dto"

describe("Testing APIResponseDTO", () => {
	it("should expect the status of the response", () => {
		const apiResponse = new APIResponseDTO(200)
		expect(apiResponse).toMatchObject({ status: 200 })
	})

	it("should be possible to recive a body data", () => {
		const body = ProductEntityMapper.toDto(new ProductEntityFake(true))
		const apiResponse = new APIResponseDTO(201, body)
		expect(apiResponse).toMatchObject({
			status: 201,
			data: body
		})
	})

	it("should have a static method for generating status 500 responses", () => {
		const apiResponse = APIResponseDTO.internalServerError()
		expect(apiResponse).toMatchObject({
			status: 500,
			data: { message: "Internal Server Error" }
		})
	})
})
