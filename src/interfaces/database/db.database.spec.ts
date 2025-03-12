import { readdir, readFile } from "node:fs/promises"
import Database from "./db.database"
import { tmpdir } from "node:os"
import { join } from "node:path"
import DatabaseDAO from "./db.database";

type ReturningRowsCb<T> = (error: Error | null, rows: T[]) => void | undefined;
type ReturningRowCb<T> = (error: Error | null, rows: T) => void;


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

	beforeEach(() => {
		DatabaseDAO.instance = undefined
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
		const migrationFileNames = [
			"migration.sql"
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
			expect(rFile.mock.calls[i][0]).toBe(join(__dirname, "migrations", migrationFileNames[i]))
			expect(rFile.mock.calls[i][1]).toMatchObject({ encoding: 'utf8' })
		}
		expect((db.db.run as jest.Mock).mock.calls).toHaveLength(migrationFileNames.length)
		expect((db.db.run as jest.Mock).mock.calls[0][0]).toBe(migrationSample)
	})

	it("should return a call to all method as an async function", async () => {
		const db = await Database.init(":memory:");
		(db.db.all as any) = jest.fn((_: string, __: any[], cb: ReturningRowsCb<any>): any => cb(null, []))
		const sql = "SELECT * FROM table;"
		const rows = await db.all(sql);
		expect(rows).toMatchObject([])
		const dbAllAsMock = db.db.all as jest.Mock
		expect(dbAllAsMock.mock.calls).toHaveLength(1)
		expect(dbAllAsMock.mock.calls[0][0]).toBe(sql)
	})

	it("should allow an array of query params", async () => {
		const db = await Database.init(":memory:");
		(db.db.all as any) = jest.fn((_: string, __: any, cb: ReturningRowsCb<any>): any => cb(null, []))
		const sql = "SELECT * FROM table WHERE name LIKE ? AND price = ?;"
		const params = ["asdf", 40]
		await db.all(sql, params)
		const dbAllAsMock = db.db.all as jest.Mock
		expect(dbAllAsMock.mock.calls[0][0]).toBe(sql)
		expect(dbAllAsMock.mock.calls[0][1]).toStrictEqual(params)
	})

	it("should return a call to get method as an async function", async () => {
		const db = await Database.init(":memory:");
		(db.db.get as any) = jest.fn((_: string, __: any, cb: ReturningRowCb<any>): any => cb(null, null))
		const sql = "SELECT * FROM table WHERE id = ?;"
		const params = [1]
		const row = await db.get(sql, params)
		expect(row).toBeNull()
		const dbGetAsMock = db.db.get as jest.Mock
		expect(dbGetAsMock.mock.calls).toHaveLength(1)
		expect(dbGetAsMock.mock.calls[0][0]).toBe(sql)
		expect(dbGetAsMock.mock.calls[0][1]).toStrictEqual(params)
	})
})

describe("Testing DatabaseDAO.getInstance() method", () => {
	beforeEach(() => {
		DatabaseDAO.instance = undefined
	})
	it("should throw an error if not previously initialized", () => {
		expect(DatabaseDAO.getInstance).toThrow(Error)
		expect(DatabaseDAO.getInstance).toThrow("not initialized")
	})
	it("should return the ininitialized instance", async () => {
		const db = await DatabaseDAO.init(":memory:")
		const instance = DatabaseDAO.getInstance()
		expect(instance).toStrictEqual(db)
	})
})
