import assert from 'assert';
import ValidationError from '.';

describe('validationError class functionality', function () {
  it('should be a subclass of the Error class', function () {
    const validationError = new ValidationError();

    assert.equal(validationError instanceof Error, true);
  });

  it('should make the constructor parameter accessible via the `message` property of the instance', function () {
    const TEST_ERROR = 'TEST_ERROR';
    const validationError = new ValidationError(TEST_ERROR);

    assert.equal(validationError.message, TEST_ERROR);
  });
});
