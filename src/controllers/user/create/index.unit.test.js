import assert from 'assert';
import { stub } from 'sinon';

import ValidationError from '../../../errors/validation-error';
import generateResSpy from '../../../tests/spies/res';
import generateCreateEngineStubs,
{ CREATE_USER_RESPONSE, VALIDATION_ERROR_MSG, GENERIC_ERROR_MSG } from '../../../tests/stubs/engines/user/create';
import createUser from '.';

describe('createUser controller functionality', function () {
  const req = {};
  const db = {};
  const validator = {};
  const dbQueryParams = {};
  const hashPassword = {};

  let res;
  let engine;
  let successResponse;
  let errResponse;
  let generateErrResponses;
  let promise;

  beforeEach(function () {
    res = generateResSpy();
  });

  describe('when invoked', function () {
    beforeEach(function () {
      engine = generateCreateEngineStubs().success;
      errResponse = stub().returns({});
      successResponse = stub().returns({});
      generateErrResponses = stub().returns({});
      return createUser(
        req, res, db, engine, validator, ValidationError,
        errResponse, successResponse, dbQueryParams, generateErrResponses, hashPassword,
      );
    });

    describe('should call the create engine function', function () {
      it('once', function () {
        assert(engine.calledOnce);
      });

      it('with req, db, validator, ValidationError and dbQueryParams as arguments', function () {
        assert(engine.calledWithExactly(
          req, db, validator, ValidationError, dbQueryParams, hashPassword,
        ));
      });
    });
  });
  describe('when invoked with a valid request object', function () {
    beforeEach(function () {
      errResponse = stub().returns({});
      successResponse = stub().returns(CREATE_USER_RESPONSE);
      generateErrResponses = stub().returns(errResponse());
      engine = generateCreateEngineStubs().success;

      promise = createUser(
        req, res, db, engine, validator, ValidationError,
        errResponse, successResponse, dbQueryParams, generateErrResponses, hashPassword,
      );
    });

    describe('should call successResponse()', function () {
      it('once', function () {
        assert(successResponse.calledOnce);
      });
      it('with res, 201, and result as arguments', function () {
        assert(successResponse.calledWithExactly(res, 201, CREATE_USER_RESPONSE));
      });
      it('should return a userId as the response', async function () {
        const result = await promise;
        assert.strictEqual(result, CREATE_USER_RESPONSE);
      });
    });
  });

  describe('when invoked with an invalid request object, it rejects with a validation error', function () {
    beforeEach(function () {
      errResponse = stub().returns({ message: VALIDATION_ERROR_MSG });
      successResponse = stub().returns({});
      generateErrResponses = stub().returns(errResponse());
      engine = generateCreateEngineStubs().validationError;

      promise = createUser(
        req, res, db, engine, validator, ValidationError,
        errResponse, successResponse, dbQueryParams, generateErrResponses, hashPassword,
      );
    });

    it('should call generateErrResponses() once', function () {
      return promise.catch(() => assert(generateErrResponses.calledOnce));
    });

    it('with res, err, errResponse and ValidationError arguments', function () {
      return promise.catch((err) => assert(
        generateErrResponses.calledWithExactly(res, err, errResponse, ValidationError),
      ));
    });

    it('should return a validtion error message as the response', async function () {
      const err = await promise;
      assert.strictEqual(err.message, VALIDATION_ERROR_MSG);
    });
  });

  describe('when invoked and it throws a generic error', function () {
    beforeEach(function () {
      errResponse = stub().returns({ message: GENERIC_ERROR_MSG });
      successResponse = stub().returns({});
      generateErrResponses = stub().returns(errResponse());
      engine = generateCreateEngineStubs().genericError;

      promise = createUser(
        req, res, db, engine, validator, ValidationError,
        errResponse, successResponse, dbQueryParams, generateErrResponses, hashPassword,
      );
    });

    it('should call generateErrResponses() once', function () {
      return promise.catch(() => assert(generateErrResponses.calledOnce));
    });

    it('with res, err, errResponse and ValidationError arguments', function () {
      return promise.catch((err) => assert(
        generateErrResponses.calledWithExactly(res, err, errResponse, ValidationError),
      ));
    });

    it('should return a generic error message as the response', async function () {
      const err = await promise;
      assert.strictEqual(err.message, GENERIC_ERROR_MSG);
    });
  });
});
