Feature: Listing products
    As a client i want to list products on the system based on some filtering criteria

    Background:
	   Given the following products
	   | id | name        | description    | price | available | category |
    	   | 1  | Fedora      | A red fedora   | 59.99 | true      | CLOTHS   |
    	   | 2  | Basket ball | A basket ball  | 10.99 | false     | TOOLS    |
	   | 3  | Fedora      | A green fedora | 59.99 | true      | CLOTHS   |
    	   | 4  | Volei ball  | A volei ball   | 10.99 | false     | TOOLS    |

    Scenario: List all products in the database
	Given that i'm in the route "/product"
	When i make a "GET" call
	Then i should see a response with status 200
	And a list with the following products:
	   | id | name        | description    | price | available | category |
    	   | 1  | Fedora      | A red fedora   | 59.99 | true      | CLOTHS   |
    	   | 2  | Basket ball | A basket ball  | 10.99 | false     | TOOLS    |
	   | 3  | Fedora      | A green fedora | 59.99 | true      | CLOTHS   |
    	   | 4  | Volei ball  | A volei ball   | 10.99 | false     | TOOLS    |

    Scenario: List all Fedora hats in the database
	Given that i'm in the route "/product"
	And i set the query argument "name" to "fedora"
	When i make a "GET" call
	Then i should see a response with status 200
	And a list with the following products:
	   | id | name        | description    | price | available | category |
    	   | 1  | Fedora      | A red fedora   | 59.99 | true      | CLOTHS   |
	   | 3  | Fedora      | A green fedora | 59.99 | true      | CLOTHS   |

    Scenario: List all products with price of 10.99 in the database
	Given that i'm in the route "/product"
	And i set the query argument "price" to "10.99"
	When i make a "GET" call
	Then i should see a response with status 200
	And a list with the following products:
	   | id | name        | description    | price | available | category |
    	   | 2  | Basket ball | A basket ball  | 10.99 | false     | TOOLS    |
    	   | 4  | Volei ball  | A volei ball   | 10.99 | false     | TOOLS    |

    Scenario: List all available products in the database
	Given that i'm in the route "/product"
	And i set the query argument "available" to "true"
	When i make a "GET" call
	Then i should see a response with status 200
	And a list with the following products:
	   | id | name        | description    | price | available | category |
    	   | 1  | Fedora      | A red fedora   | 59.99 | true      | CLOTHS   |
	   | 3  | Fedora      | A green fedora | 59.99 | true      | CLOTHS   |

    Scenario: List all products from the TOOLS category in the database
	Given that i'm in the route "/product"
	And i set the query argument "category" to "TOOLS"
	When i make a "GET" call
	Then i should see a response with status 200
	And a list with the following products:
	   | id | name        | description    | price | available | category |
    	   | 2  | Basket ball | A basket ball  | 10.99 | false     | TOOLS    |
    	   | 4  | Volei ball  | A volei ball   | 10.99 | false     | TOOLS    |
