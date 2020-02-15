import assert from 'assert';

import ValidationError from '../../../errors/validation-error';
import generateUpdateClientStubs,
{ updatedUserObject, GENERIC_ERROR }
  from '../../../tests/stubs/elasticsearch/client/update';
import generateValidatorStubs, { VALIDATION_ERROR_MESSAGE } from '../../../tests/stubs/validation';
import update from '.';

describe('update engine functionality', function () {
  let req;
  let db;
  let validator;
  let promise;

  const dbQueryParams = {
    index: process.env.ELASTICSEARCH_INDEX,
    type: 'user',
  };

  describe('when invoked with invalid user properties', function () {
    this.beforeEach(function () {
      req = {
        body: {},
        user: { _id: 5 },
      };
      db = {};
      validator = generateValidatorStubs().invalid;

      promise = update(req, db, validator, ValidationError, dbQueryParams);
    });

    it('should call the validator function once', function () {
      return promise.catch(() => assert(validator.calledOnce));
    });

    it('with the request body object as arguments', function () {
      return promise.catch(() => assert(validator.calledWithExactly(req.body)));
    });

    it('and reject with a Validation error', function () {
      return promise.catch((err) => assert(err instanceof ValidationError));
    });

    it('containing a validation error message', function () {
      return promise.catch((err) => assert.deepEqual(err.message, VALIDATION_ERROR_MESSAGE));
    });
  });

  describe('when invoked with authorization, valid user properties and the update is successful', function () {
    this.beforeEach(function () {
      req = {
        body: {},
        user: { _id: 9 },
      };
      db = { update: generateUpdateClientStubs.success() };
      validator = generateValidatorStubs().valid;

      promise = update(req, db, validator, ValidationError, dbQueryParams);
    });

    it('should call db.update()', function () {
      assert(db.update.calledOnce);
    });

    it('with the correct arguments', function () {
      assert.deepEqual(db.update.getCall(0).args[0], {
        ...dbQueryParams,
        id: req.user._id,
        body: {
          doc: {
            profile: req.body,
          },
        },
      });
    });

    it('should resolve with an updated text', function () {
      return promise.then((result) => assert.deepEqual(result, updatedUserObject.result));
    });
  });

  describe('when invoked and the elastcisearch operation is unsuccessful', function () {
    this.beforeEach(function () {
      req = {
        body: {},
        user: { _id: 9 },
      };
      db = { update: generateUpdateClientStubs.genericError() };
      validator = generateValidatorStubs().valid;

      promise = update(req, db, validator, ValidationError, dbQueryParams);
    });

    it('should call db.update()', function () {
      return promise.catch(() => assert(db.update.calledOnce));
    });

    it('and return a promise that rejects with an error', function () {
      return promise.catch((err) => assert(err instanceof Error));
    });

    it('containing an Internal server error message', function () {
      return promise.catch((err) => assert.equal(err.message, GENERIC_ERROR.message));
    });
  });
});
