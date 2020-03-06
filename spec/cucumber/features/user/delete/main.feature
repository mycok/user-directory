Feature: Delete user
    Feature Description:
    Clients should be able to send a request to our API to delete a user

    Background: Create two New Users and logs in using the Firt user credentials
        Given all documents of type 'user' are deleted
        Given 2 new users are created with random password and email
        When a client creates a POST request to /login
        And it attaches a valid Login payload
        And it sends the request
        And it saves the response text in the context under token

    Scenario: Authorization Header Missing
        When a client creates a DELETE request to /users/:userId
        And it sends the request
        Then our API should respond with a 401 HTTP status code
        And the payload of the response should be a JSON object
        And should contain a message property stating that "The authorization header must be set"

    Scenario Outline: Wrong Authorization Header
        When a client creates a DELETE request to /users/:userId
        And it sets the HTTP header field "Authorization" to "<header>"
        And it sends the request
        Then our API should respond with a 400 HTTP status code
        And the payload of the response should be a JSON object
        And should contain a message property stating that "The authorization header should use the Bearer scheme"

        Examples:
            | header                |
            | Basic e@ma.il:hunter2 |
    
    Scenario Outline: Invalid Token Format
        When a client creates a DELETE request to /users/:userId
        And it sets the HTTP header field "Authorization" to "Bearer <token>"
        And it sends the request
        Then our API should respond with a 400 HTTP status code
        And the payload of the response should be a JSON object
        And should contain a message property stating that "The credentials used in the Authorization header should be a valid bcrypt digest"

        Examples:
        | token                                                        |
        | 6g3$d21"dfG9),Ol;UD6^UG4D£SWerCSfgiJH323£!AzxDCftg7yhjYTEESF |
        | $2a$10$BZze4nPsa1D8AlCue76.sec8Z/Wn5BoG4kXgPqoEfYXxZuD27PQta |

    Scenario: Delete Self With Wrong Token Signature
        When a client creates a DELETE request to /users/:userId
        And it sets the Authorization header to a token with a wrong signature
        And it sends the request
        Then our API should respond with a 400 HTTP status code
        And the payload of the response should be a JSON object
        And should contain a message property stating that "Invalid token signature"

    Scenario: Delete Self
        When a client creates a DELETE request to /users/:userId
        And it sets the Authorization header to a valid token signature
        And it sends the request
        Then our API should respond with a 200 HTTP status code
        And the payload of the response should be a string

        When a client creates a GET request to /users/:userId
        And it sends the request
        Then our API should respond with a 404 HTTP status code
        And the payload of the response should be a JSON object
        And should contain a message property stating that 'Not Found'

    Scenario: Delete Non-Existing User
        When a client creates a DELETE request to /users/s_FhGnAB-xEYn9oELjj_
        And it sends the request
        Then our API should respond with a 404 HTTP status code
        And the payload of the response should be a JSON object
        And should contain a message property stating that 'Not Found'

    Scenario: Delete Another User Account
        When a client creates a DELETE request to /users/:user1Id
        And it sets the Authorization header to a valid token signature
        And it sends the request
        Then our API should respond with a 403 HTTP status code
        And the payload of the response should be a JSON object
        And should contain a message property stating that "You are not authorized to perform this action"
