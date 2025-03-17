Feature: Get a product
    As a client, i want to get the information about a single product

    Background:
	    Given the following products
	    | id | name        | description   | price | available | category |
    	    | 1  | Fedora      | A red fedora  | 59.99 | true      | CLOTHS   |
    	    | 2  | Basket ball | A basket Ball | 10.99 | false     | TOOLS    |

    Scenario: Fail to list a missing product
	Given that i'm in the route "/product/3"
	When i make a "GET" call
	Then i should see a response with status 404
	And a field "message" with "product with id 3 doesn't exist"

    Scenario: Return the information about a single product
	Given that i'm in the route "/product/1"
	When i make a "GET" call
	Then i should see a response with status 200
	And a field "id" with "1"
	And a field "name" with "Fedora"
	And a field "description" with "A red fedora"
	And a field "price" with "59.99"
	And a field "available" with "true"
	And a field "category" with "CLOTHS"
