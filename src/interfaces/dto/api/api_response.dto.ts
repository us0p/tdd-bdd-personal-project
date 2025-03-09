export default class APIResponseDTO {
	status: number;
	data?: any;

	constructor(status: number, data?: any) {
		this.status = status
		this.data = data
	}

	static internalServerError(): APIResponseDTO {
		return new APIResponseDTO(500, { message: "Internal Server Error" })
	}
}
