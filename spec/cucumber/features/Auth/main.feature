Feature: User Login
  Test that we can create a user and then log them in successfully

  Background: Create User with an email and password
  Given all documents of type 'user' are deleted
  Given 1 new user is created with random password and email

  Scenario: Login user with wrong email
    When a client creates a POST request to /login
    And it attaches {"email": "wrongemail@email.com", "password": "paSSword#45"} as payload
    And it sends the request
    Then our API should respond with a 404 HTTP status code
    And the payload of the response should be a JSON object
    And should contain a message property stating that "Not Found"

  Scenario: Login user with wrong password
    When a client creates a POST request to /login
    And it attaches {"email": "test@email.com", "password": "paSword#45"} as payload
    And it sends the request
    Then our API should respond with a 401 HTTP status code
    And the payload of the response should be a JSON object
    And should contain a message property stating that "Invalid password"

  Scenario: Successful User Login
    When a client creates a POST request to /login
    And it attaches a valid Login payload
    And it sends the request
    Then our API should respond with a 200 HTTP status code
    And the payload of the response should be a string
    And the string should contain the word token


