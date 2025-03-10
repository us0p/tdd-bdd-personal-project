import { Router } from "express"
import ProductController from "src/interfaces/controllers/product/product.controller"
import ProductRepository from "../database/repositories/product/product.repository"
import DatabaseDAO from "../database/db.database"

const router = Router()

const db = await DatabaseDAO.init(":memory:")
const prepo = new ProductRepository(db)
const controller = new ProductController(prepo)

router.post("/", async (req, res) => {
	const apiResponse = await controller.create(req.body)
	res.status(apiResponse.status).json(apiResponse.data).end()
})

router.get("/:id", async (req, res) => {
	const apiResponse = await controller.get(parseInt(req.params.id))
	res.status(apiResponse.status).json(apiResponse.data).end()
})

router.get("/", async (req, res) => {
	const apiResponse = await controller.find(req.query)
	res.status(apiResponse.status).json(apiResponse.data).end()
})

router.put("/:id", async (req, res) => {
	const apiResponse = await controller.update(parseInt(req.params.id), req.body)
	res.status(apiResponse.status).json(apiResponse.data).end()
})

router.delete("/:id", async (req, res) => {
	const apiResponse = await controller.delete(parseInt(req.params.id))
	res.status(apiResponse.status).json(apiResponse.data).end()
})
