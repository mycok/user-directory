Feature: Replace User Profile
 Feature Description:
   Clients should be able to send a request to our API in order to update user profiles.
   Our API should validate the structure of the request payload and respond with an
   appropriate error in case the payload is invalid.

    Scenario: Not Found Bad Request
    if a client sends a PUT request to /users/:userId/profile with an unsupported payload,
    it should recieve a response with a 4xxx status code.
    
        When a client creates a PUT request to /users/userId/profile
        And it attaches a valid Update User Profile payload
        And it sends the request
        Then our API should respond with a 404 HTTP status code
        And the payload of the response should be a JSON object
        And should contain a message property stating that "Not Found"

    Scenario Outline: Bad Requests
    if a client sends a PUT request to /users/:userId/profile with an unsupported payload,
    it should recieve a response with a 4xxx status code.

        When a client creates a PUT request to /users/:userId/profile
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

    Scenario Outline: Profile Payload with additional Properties
     Given a client creates a POST request to /users
        And it attaches a valid Create User payload
        And it sends the request
        And it saves the response text in the context under userId
    
      When a client creates a PUT request to /users/:userId/profile
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


    Scenario Outline: Profile Payload with Properties of Unsupported Type
        Given a client creates a POST request to /users
            And it attaches a valid Create User payload
            And it sends the request
            And it saves the response text in the context under userId

        When a client creates a PUT request to /users/:userId/profile
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


    Scenario: Minimal Valid Profile Replacement
        Given a client creates a POST request to /users
            And it attaches a valid Create User payload
            And it sends the request
            And it saves the response text in the context under userId
    
        When a client creates a PUT request to /users/:userId/profile
        And it attaches a valid Update User Profile payload
        And it sends the request
        Then our API should respond with a 200 HTTP status code
        And the payload of the response should be a JSON object

    Scenario Outline: Valid Profile Replacement
        Given a client creates a POST request to /users
            And it attaches a valid Create User payload
            And it sends the request
            And it saves the response text in the context under userId
    
        When a client creates a PUT request to /users/:userId/profile
        And it attaches <payload> as payload
        And it sends the request
        Then our API should respond with a 200 HTTP status code
        And the payload of the response should be a JSON object

        When a client creates a GET request to /users/:userId
        And it sends the request
        Then our API should respond with a 200 HTTP status code
        And the payload of the response should be a JSON object
        And the profile property of the response should be an object with the value <payload>
        And the entity of type user, with ID stored under userId, should be deleted

        Examples:
        | payload                                                                                      |
        | {"name":{}}                                                                                  |
        | {"name":{"first":"Michael"}}                                                                 |
        | {"bio":"bio"}                                                                                |
        | {"summary":"summary"}                                                                        |
        | {"name":{"first":"Michael","last":"Myco","middle":"Myckie"},"bio":"bio","summary":"summary"} |
    
     