import ValidationError from "./validation.error"

describe("Testing ValidationError", () => {
	it("should extend Error and populate the message field on instantiation", () => {
		try {
			throw new ValidationError("error message")
		} catch (e) {
			expect(e).toBeInstanceOf(ValidationError)
			expect(e).toBeInstanceOf(Error)
			expect(e.message).toStrictEqual("error message")
		}
	})
})
