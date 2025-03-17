Feature: Update Product
    As a client, i want to update a product.

    Background:
           Given the following products
	   | id | name        | description   | price | available | category |
    	   | 1  | Fedora      | A red fedora  | 59.99 | true      | CLOTHS   |
    	   | 2  | Basket ball | A basket Ball | 10.99 | false     | TOOLS    |

    Scenario: Fail to update product with invalid id
	   Given that i'm in the route "/product/3"
	   And i set "name" to "Cap"
	   And i set "description" to "A military cap"
	   And i set "price" to "69.99"
	   And i set "available" to "true"
	   And i set "category" to "CLOTHS"
    	   When i make a "PUT" call
    	   Then i should see a response with status 404
    	   And a field "message" with "product with id 3 doesn't exist"

    Scenario: Fail to update product name to empty name
	    Given that i'm in the route "/product/1"
	    And i set "name" to ""
	    And i set "description" to "A red fedora"
	    And i set "price" to "59.9"
	    And i set "available" to "true"
	    And i set "category" to "CLOTHS"
	    When i make a "PUT" call
	    Then i should see a response with status 409
	    And a field "message" with "name is required"

    Scenario: Fail to update product description to empty string
	    Given that i'm in the route "/product/1"
	    And i set "name" to "Fedora"
	    And i set "description" to ""
	    And i set "price" to "59.9"
	    And i set "available" to "true"
	    And i set "category" to "CLOTHS"
	    When i make a "PUT" call
	    Then i should see a response with status 409
	    And a field "message" with "description is required"

    Scenario: Fail to update product price to NaN
	    Given that i'm in the route "/product/1"
	    And i set "name" to "Fedora"
	    And i set "description" to "A red fedora"
	    And i set "price" to "asdf"
	    And i set "available" to "true"
	    And i set "category" to "CLOTHS"
	    When i make a "PUT" call
	    Then i should see a response with status 409
	    And a field "message" with "price must be a positive number"

    Scenario: Fail to update product category to invalid Category
	    Given that i'm in the route "/product/1"
	    And i set "name" to "Fedora"
	    And i set "description" to "A red fedora"
	    And i set "price" to "59.99"
	    And i set "available" to "true"
	    And i set "category" to "SHOES"
	    When i make a "PUT" call
	    Then i should see a response with status 409
	    And a field "message" with "category must be a valid Category value"

    Scenario: Updating a product
	    Given that i'm in the route "/product/2"
	    And i set "name" to "Boliche ball"
	    And i set "description" to "A solid ball"
	    And i set "price" to "99.99"
	    And i set "available" to "true"
	    And i set "category" to "TOOLS"
	    When i make a "PUT" call
	    Then i should see a response with status 200
	    And a field "id" with "2"
	    And a field "name" with "Boliche ball"
	    And a field "description" with "A solid ball"
	    And a field "price" with "99.99"
	    And a field "available" with "true"
	    And a field "category" with "TOOLS"
	    Given that i'm in the route "/product/2"
	    When i make a "GET" call
	    Then i should see a response with status 200
	    And a field "id" with "2"
	    And a field "name" with "Boliche ball"
	    And a field "description" with "A solid ball"
	    And a field "price" with "99.99"
	    And a field "available" with "true"
	    And a field "category" with "TOOLS"


    Scenario: Can't update product ID
	    Given that i'm in the route "/product/2"
	    And i set "id" to "3"
	    And i set "name" to "Boliche ball"
	    And i set "description" to "A solid ball"
	    And i set "price" to "99.99"
	    And i set "available" to "true"
	    And i set "category" to "TOOLS"
	    When i make a "PUT" call
	    Then i should see a response with status 200
	    And a field "id" with "2"
	    And a field "name" with "Boliche ball"
	    And a field "description" with "A solid ball"
	    And a field "price" with "99.99"
	    And a field "available" with "true"
	    And a field "category" with "TOOLS"
	    Given that i'm in the route "/product/2"
	    When i make a "GET" call
	    Then i should see a response with status 200
	    And a field "id" with "2"
	    And a field "name" with "Boliche ball"
	    And a field "description" with "A solid ball"
	    And a field "price" with "99.99"
	    And a field "available" with "true"
	    And a field "category" with "TOOLS"


