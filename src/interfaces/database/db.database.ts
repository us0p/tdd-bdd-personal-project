import { Database } from "sqlite3"
import { readdir, readFile } from "node:fs/promises"
import { join } from "node:path"

export default class DatabaseDAO {
	db: Database
	static instance?: DatabaseDAO

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

	async all<T>(sql: string, params?: any[]): Promise<T[]> {
		return new Promise((res, rej) => {
			this.db.all(sql, params, (err, rows: T[]) => {
				if (err) rej(err)
				res(rows)
			})
		})
	}

	async get<T>(sql: string, params: any[]): Promise<T | undefined> {
		return new Promise((res, rej) => {
			this.db.get(sql, params, (err, row: T) => {
				if (err) rej(err)
				res(row)
			})
		})
	}

	async migrate() {
		const migrations = await readdir(join(__dirname, "migrations"))
		for (const migrationPath of migrations) {
			const migration = await readFile(
				join(__dirname, "migrations", migrationPath),
				{ encoding: "utf8" }
			)
			this.db.run(migration)
		}
	}

	static getInstance(): DatabaseDAO {
		if (!DatabaseDAO.instance) throw new Error("not initialized")
		return DatabaseDAO.instance
	}
}
