import AppFactory from "./app"

async function boostrap() {
	const app = await AppFactory.devInstance()

	app.listen(5000, () => {
		console.log("Listening on port 5000")
	})
}

boostrap()
