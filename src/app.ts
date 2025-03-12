import express, { json } from "express"
import DatabaseDAO from "./interfaces/database/db.database"

export default class AppFactory {
	static async testInstance() {
		const db = await DatabaseDAO.init(":memory:")
		await db.migrate()
		const app = express()

		app.use(json())

		const { default: router } = await import("src/interfaces/routes/product.route")
		app.use("/product", router)
		return app
	}
}
