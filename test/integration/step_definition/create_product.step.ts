import { Express } from "express"
import request from "supertest"
import AppFactory from "../../../src/app"
import { Given, When, Then, BeforeAll, After } from "@cucumber/cucumber"
import assert from "node:assert"
import DatabaseDAO from "src/interfaces/database/db.database"

let app: Express;

BeforeAll(async function() {
	app = await AppFactory.testInstance()
})

After(async function() {
	const db = DatabaseDAO.getInstance()
	db.db.run("DELETE FROM product;")
})

Given('the following products', async function(dataTable) {
	const { rawTable: [_, ...rows] } = dataTable
	const db = DatabaseDAO.getInstance()
	for (const row of rows) {
		await db.get(
			"INSERT INTO product (id,name,description,price,available,category) VALUES (?,?,?,?,?,?)",
			row
		);
	}
});

Given('that i\'m in the route {string}', function(route) {
	this.route = route
});

Given('i don\'t send any data in the body', function() {
	this.body = {}
});

Given('i set {string} to {string}', function(fieldName, value) {
	if (this.body) {
		this.body[fieldName] = value
		return
	}

	this.body = {
		[fieldName]: value
	}
});

When('i make a {string} call', function(method) {
	this.method = method
});

Then('i should see a response with status {int}', async function(statusCode) {
	const req = request(app)
	switch (this.method) {
		case ("POST"): {
			this.response = await req.post(this.route)
				.send(this.body)
				.set("Accept", "application/json")
			break;
		}
		case ("PUT"): {
			this.response = await req.put(this.route)
				.send(this.body)
				.set("Accept", "application/json")
			break;
		}
		case ("DELETE"): {
			this.response = await req.delete(this.route)
				.set("Accept", "application/json")
			break;
		}
		case ("GET"): {
			this.response = await req.get(this.route)
				.query(this.query)
				.set("Accept", "application/json")

			break;
		}
	}

	assert.strictEqual(this.response.status, statusCode)
});

Then('a field {string} with {string}', function(field, message) {
	assert.strictEqual(this.response.body[field].toString(), message)
});

Then('i shouldn\'t receive any response body', function() {
	assert.deepStrictEqual(this.response.body, {})
});

Then('a list with the following products:', function(dataTable) {
	const { rawTable: [columns, ...products] } = dataTable
	const body = this.response.body
	for (let i = 0; i < body.length; i++) {
		const product = body[i];
		const expectedProduct = products[i];
		for (let j = 0; j < columns.length; j++) {
			const column = columns[j];
			assert.strictEqual(product[column].toString(), expectedProduct[j])
		}
	}
});

Given('i set the query argument {string} to {string}', function(queryParam, queryValue) {
	this.query = {
		[queryParam]: queryValue
	}
});
