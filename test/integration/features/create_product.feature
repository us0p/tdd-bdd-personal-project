Feature: Create Product
    As a client, i want to create an product.

Scenario: Fail to create product without data
	Given that i'm the route "/product"
	But i don't send any data in the body
	When i make a "POST" call
	Then i should see a reponse with status 409
	And a field "message" with "name is required"

