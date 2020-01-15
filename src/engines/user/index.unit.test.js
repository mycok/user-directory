import assert from 'assert';
import { stub } from 'sinon';

import ValidationError from '../../errors/validation-error';
import create from '.';

describe('create user engine functionality', function () {
  let req;
  let db;
  let validator;
  const dbIndexResult = {};
  this.beforeEach(function () {
    req = {
      body: {},
    };
    db = {
      index: stub().resolves(dbIndexResult),
    };
  });

  describe('when invoked and the validator function returns undefined', function () {
    let promise;
    this.beforeEach(function () {
      validator = stub().returns(undefined);
      promise = create(req, db, validator, ValidationError);
      return promise;
    });
    describe('should call the validator()', function () {
      it('once', function () {
        assert(validator.calledOnce);
      });

      it('with request body as the only argument', function () {
        assert(validator.calledWithExactly(req.body));
      });

      it('should relay the promise returned by calling db.index()', function () {
        promise.then((result) => {
          assert.strictEqual(result, dbIndexResult);
        });
      });
    });
  });

  describe('when invoked and the validator function returns an instance of ValidationError', function () {
    it('should reject with the ValidationError from the validator function', function () {
      const validationError = new ValidationError();
      validator = stub().returns(validationError);

      return create(req, db, validator, ValidationError)
        .catch((err) => assert.strictEqual(err, validationError));
    });
  });

  describe('when invoked and the db function rejects with an instance of a generic error', function () {
    it('should reject with an internal server error', function () {
      validator = stub().returns(undefined);
      db = {
        index: stub().rejects(),
      };

      return create(req, db, validator, ValidationError)
        .catch((err) => assert.strictEqual(err.message, 'Internal server error'));
    });
  });
});
