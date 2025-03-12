Feature: Create Product
    As a client, i want to create an product.

    Scenario: Fail to create product without data
	   Given that i'm in the route "/product"
    	   But i don't send any data in the body
    	   When i make a "POST" call
    	   Then i should see a response with status 409
    	   And a field "message" with "name is required"

    Scenario: Fail to create product without description
	    Given that i'm in the route "/product"
	    And i set "name" to "Fedora"
	    And i set "price" to "59.9"
	    And i set "available" to "true"
	    And i set "category" to "CLOTHS"
	    When i make a "POST" call
	    Then i should see a response with status 409
	    And a field "message" with "description is required"

    Scenario: Fail to create product without price
	    Given that i'm in the route "/product"
	    And i set "name" to "Fedora"
	    And i set "description" to "A red fedora"
	    And i set "available" to "true"
	    And i set "category" to "CLOTHS"
	    When i make a "POST" call
	    Then i should see a response with status 409
	    And a field "message" with "price must be a positive number"

    Scenario: Fail to create product without category
	    Given that i'm in the route "/product"
	    And i set "name" to "Fedora"
	    And i set "description" to "A red fedora"
	    And i set "price" to "59.9"
	    And i set "available" to "true"
	    When i make a "POST" call
	    Then i should see a response with status 409
	    And a field "message" with "category must be a valid Category value"

    Scenario: Creating a product
	    Given that i'm in the route "/product"
	    And i set "name" to "Fedora"
	    And i set "description" to "A red Fedora"
	    And i set "price" to "59.9"
	    And i set "available" to "true"
	    And i set "category" to "CLOTHS"
	    When i make a "POST" call
	    Then i should see a response with status 201
	    And a field "name" with "Fedora"
	    And a field "description" with "A red Fedora"
	    And a field "price" with "59.9"
	    And a field "available" with "true"
	    And a field "category" with "CLOTHS"

