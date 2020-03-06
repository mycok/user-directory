Feature: Update User Profile
    Feature Description:
    Clients should be able to send a request to our API in order to update user profiles.
    Our API should validate the structure of the request payload and respond with an
    appropriate error in case the payload is invalid.

    Background: Create two New Users and logs in using the Firt user credentials
        Given all documents of type 'user' are deleted
        Given 2 new users are created with random password and email
        When a client creates a POST request to /login
        And it attaches a valid Login payload
        And it sends the request
        And it saves the response text in the context under token

    Scenario: Authorization Header Missing
        When a client creates a PATCH request to /users/:userId/profile
        And it attaches a valid Update User Profile payload
        And it sends the request
        Then our API should respond with a 401 HTTP status code
        And the payload of the response should be a JSON object
        And should contain a message property stating that "The authorization header must be set"

    Scenario Outline: Wrong Authorization Header
        When a client creates a PATCH request to /users/:userId/profile
        And it sets the HTTP header field "Authorization" to "<header>"
        And it attaches a valid Update User Profile payload
        And it sends the request
        Then our API should respond with a 400 HTTP status code
        And the payload of the response should be a JSON object
        And should contain a message property stating that "The authorization header should use the Bearer scheme"

        Examples:
            | header                |
            | Basic e@ma.il:hunter2 |

    Scenario Outline: Invalid Token Format
        When a client creates a PATCH request to /users/:userId/profile
        And it sets the HTTP header field "Authorization" to "Bearer <token>"
        And it attaches a valid Update User Profile payload
        And it sends the request
        Then our API should respond with a 400 HTTP status code
        And the payload of the response should be a JSON object
        And should contain a message property stating that "The credentials used in the Authorization header should be a valid bcrypt digest"

        Examples:
            | token                                                        |
            | 6g3$d21"dfG9),Ol;UD6^UG4D£SWerCSfgiJH323£!AzxDCftg7yhjYTEESF |
            | $2a$10$BZze4nPsa1D8AlCue76.sec8Z/Wn5BoG4kXgPqoEfYXxZuD27PQta |

    Scenario: Update Self With Wrong Token Signature
        When a client creates a PATCH request to /users/:userId/profile
        And it sets the Authorization header to a token with a wrong signature
        And it attaches a valid Update User Profile payload
        And it sends the request
        Then our API should respond with a 400 HTTP status code
        And the payload of the response should be a JSON object
        And should contain a message property stating that "Invalid token signature"

    Scenario: Not Found Bad Request
        if a client sends a PATCH request to /users/:userId/profile with an unsupported payload,
        it should recieve a response with a 4xxx status code.

        When a client creates a PATCH request to /users/userId/profile
        And it sets the Authorization header to a valid token signature
        And it attaches a valid Update User Profile payload
        And it sends the request
        Then our API should respond with a 404 HTTP status code
        And the payload of the response should be a JSON object
        And should contain a message property stating that "Not Found"

    Scenario Outline: Bad Requests
        if a client sends a PATCH request to /users/:userId/profile with an unsupported payload,
        it should recieve a response with a 4xxx status code.

        When a client creates a PATCH request to /users/:userId/profile
        And it sets the Authorization header to a valid token signature
        And it attaches a generic <payloadType> payload
        And it sends the request
        Then our API should respond with a <statusCode> HTTP status code
        And the payload of the response should be a JSON object
        And should contain a message property stating that <message>

        Examples:
            | payloadType    | statusCode | message                                                                |
            | empty          | 400        | "Payload should not be empty"                                          |
            | malformed JSON | 400        | "Payload should be in JSON format"                                     |
            | non JSON       | 415        | 'The "Content-Type" header property must always be "application/json"' |

    Scenario Outline: Profile Payload With Additional Properties
        When a client creates a PATCH request to /users/:userId/profile
        And it sets the Authorization header to a valid token signature
        And it attaches an Update User Profile payload with additional <additionalField> fields
        And it sends the request
        Then our API should respond with a 400 HTTP status code
        And the payload of the response should be a JSON object
        And should contain a message property stating that "<message>"
        And the entity of type user, with ID stored under userId, should be deleted

        Examples:
            | additionalField | message                                                |
            | foo             | The '.profile' object does not support the field 'foo' |
            | foo, bar        | The '.profile' object does not support the field 'foo' |


    Scenario Outline: Profile Payload With Properties Of Unsupported Type
        When a client creates a PATCH request to /users/:userId/profile
        And it sets the Authorization header to a valid token signature
        And it attaches an Update User Profile payload where the <field> field is not a <type>
        And it sends the request
        Then our API should respond with a 400 HTTP status code
        And the payload of the response should be a JSON object
        And should contain a message property stating that "The '.profile.<field>' field must be of type <type>"
        And the entity of type user, with ID stored under userId, should be deleted

        Examples:
            | field       | type   |
            | bio         | string |
            | summary     | string |
            | name        | object |
            | name.first  | string |
            | name.middle | string |
            | name.last   | string |


    Scenario: Valid Profile Update
        When a client creates a PATCH request to /users/:userId/profile
        And it sets the Authorization header to a valid token signature
        And it attaches a valid Update User Profile payload
        And it sends the request
        Then our API should respond with a 200 HTTP status code
        And the payload of the response should be a JSON object

        When a client creates a GET request to /users/:userId
        And it sends the request
        Then our API should respond with a 200 HTTP status code
        And the payload of the response should be a JSON object
        And the root property of the response should be an object with the value {"profile":{"name":{"first":"Michael","last":"Myco","middle":"Myckie"},"bio":"bio","summary":"summary"}}
        And the entity of type user, with ID stored under userId, should be deleted

    Scenario: Update Another User Account
        When a client creates a PATCH request to /users/:user1Id/profile
        And it sets the Authorization header to a valid token signature
        And it attaches a valid Update User Profile payload
        And it sends the request
        Then our API should respond with a 403 HTTP status code
        And the payload of the response should be a JSON object
        And should contain a message property stating that "You are not authorized to perform this action"

