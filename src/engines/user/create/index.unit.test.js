import assert from 'assert';
import { stub } from 'sinon';

import ValidationError from '../../../errors/validation-error';
import generateValidatorStubs, { VALIDATION_ERROR } from '../../../tests/stubs/validation';
import generateGetClientStubs,
{ INDEX_RESOLVED_OBJ, GENERIC_ERROR }
  from '../../../tests/stubs/elasticsearch/client/index';
import create from '.';


describe('create engine functionality', function () {
  const req = {
    body: {
      email: 'test@usermail.com',
      password: {},
    },
  };
  const dbQueryParams = {
    index: process.env.ELASTICSEARCH_INDEX,
    type: 'user',
  };
  const hashPassword = stub().returns({});

  let db;
  let validator;
  let promise;

  describe('when invoked', function () {
    this.beforeEach(function () {
      db = {
        index: generateGetClientStubs.success(),
      };
      validator = generateValidatorStubs().valid;
      return create(req, db, validator, ValidationError, dbQueryParams, hashPassword);
    });

    it('should call the client.index() with the correct params', function () {
      assert.deepEqual(db.index.getCall(0).args[0], {
        ...dbQueryParams,
        body: { ...req.body, searchTerm: req.body.email.replace(/[^\w-]/gi, '').trim() },
      });
    });
  });

  describe('when invoked', function () {
    this.beforeEach(function () {
      db = {
        index: generateGetClientStubs.success(),
      };
      validator = generateValidatorStubs().valid;
      return create(req, db, validator, ValidationError, dbQueryParams, hashPassword);
    });

    it('should call the hashPassword() with the correct params', function () {
      assert.deepEqual(hashPassword.getCall(0).args[0], req.body.password);
    });
  });

  describe('when invoked and the validator function returns undefined', function () {
    this.beforeEach(function () {
      db = {
        index: generateGetClientStubs.success(),
      };
      validator = generateValidatorStubs().valid;
      promise = create(req, db, validator, ValidationError, dbQueryParams, hashPassword);
    });
    describe('should call the validator()', function () {
      it('once', function () {
        assert(validator.calledOnce);
      });

      it('with request body as the only argument', function () {
        assert(validator.calledWithExactly(req.body));
      });

      it('and resolve with a userId', function () {
        return promise.then((result) => assert.deepEqual(result, INDEX_RESOLVED_OBJ));
      });
    });
  });

  describe('when invoked and the validator function returns an instance of ValidationError', function () {
    this.beforeEach(function () {
      db = {
        index: generateGetClientStubs.success(),
      };
      validator = generateValidatorStubs().invalid;
      promise = create(req, db, validator, ValidationError, dbQueryParams, hashPassword);
    });
    it('should reject with a ValidationError', function () {
      return promise.catch((err) => assert.strictEqual(err, VALIDATION_ERROR));
    });
  });

  describe('when invoked and the db function rejects with an instance of a generic error', function () {
    this.beforeEach(function () {
      db = {
        index: generateGetClientStubs.genericError(),
      };
      validator = generateValidatorStubs().valid;
      promise = create(req, db, validator, ValidationError, dbQueryParams, hashPassword);
    });
    it('should reject with an internal server error', function () {
      return promise.catch((err) => assert.strictEqual(err.message, GENERIC_ERROR.message));
    });
  });
});
