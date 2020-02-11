Feature: Search
 Feature Description:
    Clients should be able to send a request to our API to retrieve all users that match a specific search query.
    
    Background: Create users from sample data
        Given all documents of type 'user' are deleted
        And all documents in the "random-user-data" sample are added to the index with type "user"
     
    Scenario: No search query term provided
        When a client creates a GET request to /users
        And it sends the request
        Then our API should respond with a 200 HTTP status code
        And the payload of the response should be an array
        And should contain 10 items

    Scenario Outline: No search query term provided and there are 10 or fewer items
     Given all documents of type 'user' are deleted
        And <count> documents in the "random-user-data" sample are added to the index with type "user"
        When a client creates a GET request to /users
        And it sends the request
        Then our API should respond with a 200 HTTP status code
        And the payload of the response should be an array
        And should contain <count> items

        Examples: 
        |  count  | 
        | 0       | 
        | 5       |
        | 2       | 
     
    Scenario Outline: Search query term provided and should return the matched user objects
        When a client creates a GET request to /users/
        And sets "query=<searchTerm>" as the query parameter
        And it sends the request
        Then our API should respond with a 200 HTTP status code
        And the payload of the response should be an array
        And the first item of the response should contain a property profile.name.first set to <firstName>

        Examples: 
        |  searchTerm        | firstName |
        | Norway             |  Sindre   |
        | Web Performance    |  Paul     |
        | Osmani             |  Addy     |
