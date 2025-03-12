import request from "supertest"
import AppFactory from "../../../src/app"
import { Given, When, Then } from "@cucumber/cucumber"
import assert from "node:assert"

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
	const app = await AppFactory.testInstance()

	this.response = await request(app)
		.post(this.route)
		.send(this.body)
		.set("Accept", "application/json")

	assert.strictEqual(this.response.status, statusCode)
});

Then('a field {string} with {string}', function(field, message) {
	assert.strictEqual(this.response.body[field].toString(), message)
});
