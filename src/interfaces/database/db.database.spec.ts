import { readdir, readFile } from "node:fs/promises"
import Database from "./db.database"
import { tmpdir } from "node:os"
import { join } from "node:path"

jest.mock("node:fs/promises")

describe("Testing Database", () => {
	let tmpDirPath: string
	const originalFsModule = jest.requireActual("node:fs/promises")

	beforeAll(async () => {
		tmpDirPath = await originalFsModule.mkdtemp(join(tmpdir(), "/"))
	})

	afterAll(async () => {
		await originalFsModule.rm(tmpDirPath, { recursive: true, force: true })
	})

	it("should expect the location of the database", async () => {
		await Database.init(join(tmpDirPath, "db.sqlite"))
		const tmpDirFiles = await originalFsModule.readdir(tmpDirPath)
		expect(tmpDirFiles).toStrictEqual(['db.sqlite'])
	})

	it("must call init method", async () => {
		const db1 = await Database.init(":memory:")
		const db2 = await Database.init(":memory:")
		expect(db1).toStrictEqual(db2)
	})

	it("should call db prepare, run and finalize methods with all the migrations", async () => {
		const rdir = readdir as jest.Mock
		const rFile = readFile as jest.Mock
		const migrationsFolderPath = join(__dirname, "migrations")
		const migrationFileNames = [
			join(migrationsFolderPath, "migration.sql")
		]
		const migrationSample = "CREATE TABLE product (name TEXT);"
		rdir.mockResolvedValue(migrationFileNames)
		rFile.mockResolvedValue(migrationSample)

		const db = await Database.init(":memory:")
		db.db.run = jest.fn((_: any, __: any): any => null)

		await db.migrate()

		expect(rdir.mock.calls).toHaveLength(1)
		expect(rdir.mock.calls[0][0]).toBe(join(__dirname, "migrations"))
		expect(rFile.mock.calls).toHaveLength(migrationFileNames.length)

		for (let i = 0; i < migrationFileNames.length; i++) {
			expect(rFile.mock.calls[i][0]).toBe(migrationFileNames[i])
			expect(rFile.mock.calls[i][1]).toMatchObject({ encoding: 'utf8' })
		}
		expect((db.db.run as jest.Mock).mock.calls).toHaveLength(migrationFileNames.length)
		expect((db.db.run as jest.Mock).mock.calls[0][0]).toBe(migrationSample)
	})
})
