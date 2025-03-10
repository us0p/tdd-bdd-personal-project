import request from "supertest"
import AppFactory from "src/app"
import { Given, When, Then } from "@cucumber/cucumber"

Given('that i\'m the route {string}', function(route) {
	this.route = route
});

Given('i don\'t send any data in the body', function() {
	this.body = ""
});

When('i make a {string} call', function(method) {
	this.method = method
});

Then('i should see a reponse with status {int}', async function(statusCode) {
	const app = await AppFactory.testInstance()
	this.response = await request(app)[this.method](this.route).send(this.body)
	expect(this.response.status).toBe(statusCode)
});

Then('a field {string} with {string}', function(field, message) {
	expect(this.response.body[field]).toBe(message)
});
