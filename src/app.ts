import express from "express"

export default class AppFactory {
	static async testInstance() {
		const app = express()
	}
}
