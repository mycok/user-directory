import assert from 'assert';

import ValidationError from '../../../errors/validation-error';
import generateValidatorStubs, { VALIDATION_ERROR } from '../../../tests/stubs/validation';
import generateGetClientStubs,
{ INDEX_RESOLVED_OBJ, GENERIC_ERROR }
  from '../../../tests/stubs/elasticsearch/client/index';
import create from '.';

describe('create user engine functionality', function () {
  const req = {
    body: {},
  };
  let db;
  let validator;
  let promise;

  describe('when invoked and the validator function returns undefined', function () {
    this.beforeEach(function () {
      db = {
        index: generateGetClientStubs.success(),
      };
      validator = generateValidatorStubs().valid;
      promise = create(req, db, validator, ValidationError);
    });
    describe('should call the validator()', function () {
      it('once', function () {
        assert(validator.calledOnce);
      });

      it('with request body as the only argument', function () {
        assert(validator.calledWithExactly(req.body));
      });

      it('should relay the promise returned by calling db.index()', function () {
        return promise.then((result) => assert.strictEqual(result, INDEX_RESOLVED_OBJ));
      });
    });
  });

  describe('when invoked and the validator function returns an instance of ValidationError', function () {
    this.beforeEach(function () {
      db = {
        index: generateGetClientStubs.success(),
      };
      validator = generateValidatorStubs().invalid;
      promise = create(req, db, validator, ValidationError);
    });
    it('should reject with the ValidationError from the validator function', function () {
      return promise.catch((err) => assert.strictEqual(err, VALIDATION_ERROR));
    });
  });

  describe('when invoked and the db function rejects with an instance of a generic error', function () {
    this.beforeEach(function () {
      db = {
        index: generateGetClientStubs.genericError(),
      };
      validator = generateValidatorStubs().valid;
      promise = create(req, db, validator, ValidationError);
    });
    it('should reject with an internal server error', function () {
      return promise.catch((err) => assert.strictEqual(err.message, GENERIC_ERROR.message));
    });
  });
});
