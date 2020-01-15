import assert from 'assert';
import generateValidationErrorMessages from '.';

describe('generatevalidationErrorMessages functionality', function () {
  it('should return the correct message when keyword is "required"', function () {
    const errors = [{
      keyword: 'required',
      dataPath: '.test.path',
      params: {
        missingProperty: 'property',
      },
    }];
    const actualMessage = generateValidationErrorMessages(errors);
    const expectedErrorMessage = "The '.test.path.property' field is missing";

    assert.equal(actualMessage, expectedErrorMessage);
  });

  it('should return the correct message when keyword is "type"', function () {
    const errors = [{
      keyword: 'type',
      dataPath: '.test.path',
      params: {
        type: 'string',
      },
    }];

    const actualMessage = generateValidationErrorMessages(errors);
    const expectedErrorMessage = "The '.test.path' field must be of type string";

    assert.equal(actualMessage, expectedErrorMessage);
  });

  it('should return the correct message when keyword is "format"', function () {
    const errors = [{
      keyword: 'format',
      dataPath: '.test.path',
      params: {
        format: 'email',
      },
    }];

    const actualMessage = generateValidationErrorMessages(errors);
    const expectedErrorMessage = "The '.test.path' field must be a valid email";

    assert.equal(actualMessage, expectedErrorMessage);
  });

  it('should return the correct message when keyword is "additionalProperties"', function () {
    const errors = [{
      keyword: 'additionalProperties',
      dataPath: '.test.path',
      params: {
        additionalProperty: 'photo',
      },
    }];

    const actualMessage = generateValidationErrorMessages(errors);
    const expectedErrorMessage = "The '.test.path' object does not support the field 'photo'";

    assert.equal(actualMessage, expectedErrorMessage);
  });
});
