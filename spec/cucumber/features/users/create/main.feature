Feature: Create User

   Feature Description:
   Clients should be able to send a request to our API in order to create user accounts.
   Our API should also validate the structure of the request payload and respond with an
   appropriate error in case the payload is invalid.

   Scenario Outline: Bad Client Requests

      If the client sends a POST request to /users with an invalid payload, it should
      recieve a json response with a 4xx HTTP status code.

      When a client creates a POST request to /users
      And it attaches a generic <payloadType> payload
      And it sends the request
      Then our API should respond with a <statusCode> HTTP status code
      And the payload of the response should be a JSON object
      And should contain a message property stating that <message>

      Examples:
         | payloadType    | statusCode | message                                                       |
         | empty          | 400        | "Payload should not be empty"                                 |
         | malformed JSON | 400        | "Payload should be in JSON format"                            |
         | non JSON       | 415        | 'The "Content-Type" header property must always be "application/json"' |

   Scenario Outline: Request Payload With Missing Required Properties

      When a client creates a POST request to /users
      And it attaches a Create User payload which is missing the <missingFields> field
      And it sends the request
      Then our API should respond with a 400 HTTP status code
      And the payload of the response should be a JSON object
      And should contain a message property stating that <message>

      Examples:
      | missingFields | message |
      | email         | "The '.email' field is missing" |
      | password      | "The '.password' field is missing" |

   Scenario Outline: Request Payload With Properties of Unsupported Type

   When a client creates a POST request to /users
   And it attaches a Create User payload where the <field> field is not a <type>
   And it sends the request
   Then our API should respond with a 400 HTTP status code
   And the payload of the response should be a JSON object
   And should contain a message property stating that "The '.<field>' field must be of type <type>"

   Examples:
   | field | type |
   | email | string |
   | password | string |

   Scenario Outline: Request Payload With An Invalid Email Format

   When a client creates a POST request to /users
   And it attaches a Create User payload where the email field is exactly <email>
   And it sends the request
   Then our API should respond with a 400 HTTP status code
   And the payload of the response should be a JSON object
   And should contain a message property stating that "The '.email' field must be a valid email"

   Examples:
   | email |
   | a238juqy2 |
   | a@1.2.3.4 |
   | a,b,c@!! |

   Scenario Outline: Request Payload With An Invalid Password Format

   When a client creates a POST request to /users
   And it attaches a Create User payload where the password field is exactly <password>
   And it sends the request
   Then our API should respond with a 400 HTTP status code
   And the payload of the response should be a JSON object
   And should contain a message property stating that "The '.password' field should contain atleast 8 characters with a lowercase, uppercase, a number and a special character"

   Examples:
   | password |
   | short |
   | paSsword23 |
   | password#23 |

   Scenario: Minimal Valid User

   When a client creates a POST request to /users
   And it attaches a valid Create User payload
   And it sends the request
   Then our API should respond with a 201 HTTP status code
   And the payload of the response should be a string
   And the payload object should be added to the database, grouped under the "user" type
   And the newly created user should be deleted

   Scenario Outline: Invalid Profile

   When a client creates a POST request to /users
   And it attaches <payload> as payload
   And it sends the request
   Then our API should respond with a 400 HTTP status code
   And the payload of the response should be a JSON object
   And should contain a message property stating that "<message>"

   Examples:
   | payload | message |
   | {"email": "e@ma.il", "password": "pasSword#23", "profile": {"foo": "bar"}} | The '.profile' object does not support the field 'foo' |
   | {"email": "e@ma.il", "password": "pasSword#23", "profile": {"name": {"first": "jane", "a": "b"}}} | The '.profile.name' object does not support the field 'a' |
   | {"email": "e@ma.il", "password": "pasSword#23", "profile": {"summary": 0}} | The '.profile.summary' field must be of type string |
   | {"email": "e@ma.il", "password": "pasSword#23", "profile": {"bio": 0}} | The '.profile.bio' field must be of type string |

   Scenario Outline: Valid User Profile

   When a client creates a POST request to /users
   And it attaches <payload> as payload
   And it sends the request
   Then our API should respond with a 201 HTTP status code
   And the payload of the response should be a string
   And the payload object should be added to the database, grouped under the "user" type
   And the newly created user should be deleted

   Examples:
   | payload |
   | {"email": "e@ma.il", "password": "pasSword#23", "profile": {}} |
   | {"email": "e@ma.il", "password": "pasSword#23", "profile": {"name": {}}} |
   | {"email": "e@ma.il", "password": "pasSword#23", "profile": {"name": {"first": "Michael"}}} |
   | {"email": "e@ma.il", "password": "pasSword#23", "profile": {"bio": ""}} |
   | {"email": "e@ma.il", "password": "pasSword#23", "profile": {"summary": "summary"}} |
