Feature: Retrieve User
 Feature Description:
    Clients should be able to send a request to our API to retrieve a user that matches a specific id.
    Our API should be able to respond with a user object for cases where a user is matched.
    Our API should be able to respond with a Not Found error for cases where no user was matched

    Scenario: Retrieve a non existing user
      When a client creates a GET request to /users/s_FhGnAB-xEYn9oELjj_
      And it sends the request
      Then our API should respond with a 404 HTTP status code
      And the payload of the response should be a JSON object
      And should contain a message property stating that 'Not Found'
     

    Scenario: Retrieve user by id
     Given a client creates a POST request to /users
        And it attaches a valid Create User payload
        And it sends the request
        And it saves the response text in the context under userId

        When a client creates a GET request to /users/:userId
        And it sends the request
        Then our API should respond with a 200 HTTP status code
        And the payload of the response should be a JSON object
        And the root property of the response should be the same as context.requestPayload but without the password field
        And the entity of type user, with ID stored under userId, should be deleted
