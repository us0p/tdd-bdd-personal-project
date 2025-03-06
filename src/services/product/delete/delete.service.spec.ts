import DeleteProductService from "./delete.service"

describe("Testing DeleteProductService", () => {
	it("should make a call to repository delete method and return its value", async () => {
		const repo: any = {
			delete: jest.fn(async (_) => undefined)
		}
		const service = new DeleteProductService(repo)
		const deletedProduct = await service.exec(1)

		expect(deletedProduct).toBeUndefined()
		expect(repo.delete.mock.calls).toHaveLength(1)
		expect(repo.delete.mock.calls[0][0]).toBe(1)
	})
})
