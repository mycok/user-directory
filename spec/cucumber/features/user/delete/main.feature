Feature: Delete user
 Feature Description:
    Clients should be able to send a request to our API to delete a user
    
    Scenario: Delete self
        Given a client creates a POST request to /users
        And it attaches a valid Create User payload
        And it sends the request
        And it saves the response text in the context under userId

        When a client creates a DELETE request to /users/:userId
        And it sends the request
        Then our API should respond with a 200 HTTP status code
        And the payload of the response should be a string
    
        When a client creates a GET request to /users/:userId
        And it sends the request
        Then our API should respond with a 404 HTTP status code
        And the payload of the response should be a JSON object
        And should contain a message property stating that 'Not Found'

    Scenario: Delete Non-existing user
        When a client creates a DELETE request to /users/s_FhGnAB-xEYn9oELjj_
        And it sends the request
        Then our API should respond with a 404 HTTP status code
        And the payload of the response should be a JSON object
        And should contain a message property stating that 'Not Found'
