Feature: General

   Scenario Outline: POST, PUT and PATCH Requests Should Have Non-Empty Payloads

      All POST, PUT and PATCH requests must have non-zero values for its "Content-Length" header property

      When a client creates a <method> request to /users
      And it attaches a generic empty payload
      And it sends the request
      Then our API should respond with a 400 HTTP status code
      And the payload of the response should be a JSON object
      And should contain a message property stating that 'Payload should not be empty'

      Examples:
         | method |
         | POST   |
         # | PUT    |
         # | PATCH  |

   Scenario Outline: Content-Type Header Property Should Be Set For Requests With NonEmpty Payloads
      All requests with non-zero value for their Content-Length header property must have their
      Content-Type property set

      When a client creates a <method> request to /users
      And it attaches a generic non JSON payload
      But without setting the "Content-Type" property
      And it sends the request
      Then our API should respond with a 400 HTTP status code
      And the payload of the response should be a JSON object
      And should contain a message property stating that 'The "Content-Type" header property must be set for requests with a non empty payload'

      Examples:
         | method |
         | POST   |
         # | PUT    |
         # | PATCH  |

   Scenario Outline: Content-Type Header Should Be Set To 'application/json'
      All requests which have a "Content-Type" header property must have set its value to "application/json"

      When a client creates a <method> request to /users
      And it attaches a generic non JSON payload
      And it sends the request
      Then our API should respond with a 415 HTTP status code
      And the payload of the response should be a JSON object
      And should contain a message property stating that 'The "Content-Type" header property must always be "application/json"'

      Examples:
         | method |
         | POST   |
         # | PUT    |
         # | PATCH  |
