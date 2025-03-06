import { Database } from "sqlite3"
import { readdir, readFile } from "node:fs/promises"
import { join } from "node:path"

export default class DatabaseDAO {
	db: Database
	static instance: DatabaseDAO

	private constructor(db: Database) {
		this.db = db
	}

	static async init(path: string): Promise<DatabaseDAO> {
		if (DatabaseDAO.instance) return DatabaseDAO.instance

		const db: Database = await new Promise((res, rej) => {
			const db = new Database(path, (err) => {
				if (err) rej(err)
				res(db)
			})
		})

		const dbDao = new DatabaseDAO(db)
		DatabaseDAO.instance = dbDao
		return dbDao
	}

	async migrate() {
		const migrations = await readdir(join(__dirname, "migrations"))
		for (const migrationPath of migrations) {
			const migration = await readFile(migrationPath, { encoding: "utf8" })
			this.db.run(migration)
		}
	}
}
