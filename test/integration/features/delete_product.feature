Feature: Deleting a product
    As a client i want to delete a product    

    Background:
	   Given the following products
	   | id | name        | description   | price | available | category |
    	   | 1  | Fedora      | A red fedora  | 59.99 | true      | CLOTHS   |
    	   | 2  | Basket ball | A basket Ball | 10.99 | false     | TOOLS    |

    Scenario: Fail to delete a product which ID doesn't exist
	   Given that i'm in the route "/product/3"
    	   When i make a "DELETE" call
    	   Then i should see a response with status 404
    	   And a field "message" with "product with id 3 doesn't exist"

    Scenario: Delete a product with the provided ID
	    Given that i'm in the route "/product/1"
	    When i make a "DELETE" call
	    Then i should see a response with status 204
	    But i shouldn't receive any response body
	    Given that i'm in the route "/product/1"
	    When i make a "GET" call
	    Then i should see a response with status 404
	    And a field "message" with "product with id 1 doesn't exist"
