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

  let res;
  let engine;
  let successResponse;
  let errResponse;
  let promise;

  beforeEach(function () {
    res = generateResSpy();
  });

  describe('when invoked', function () {
    beforeEach(function () {
      engine = generateCreateEngineStubs().success;
      errResponse = stub().returns({});
      successResponse = stub().returns({});
      return createUser(
        req, res, db, engine, validator, ValidationError, errResponse, successResponse,
      );
    });

    describe('should call the create engine function', function () {
      it('once', function () {
        assert(engine.calledOnce);
      });

      it('with req, db, validator and ValidationError as arguments', function () {
        assert(engine.calledWithExactly(req, db, validator, ValidationError));
      });
    });
  });
  describe('when invoked with a valid request object', function () {
    beforeEach(function () {
      errResponse = stub().returns({});
      successResponse = stub().returns(CREATE_USER_RESPONSE._id);
      engine = generateCreateEngineStubs().success;
      promise = createUser(
        req, res, db, engine, validator, ValidationError, errResponse, successResponse,
      );
    });

    describe('should call successResponse()', function () {
      it('once', function () {
        assert(successResponse.calledOnce);
      });
      it('with res, 201, result and content-type as arguments', function () {
        assert(successResponse.calledWithExactly(res, 201, CREATE_USER_RESPONSE._id, 'text/plain'));
      });
      it('should return a userId as the response', async function () {
        const result = await promise;
        assert.strictEqual(result, CREATE_USER_RESPONSE._id);
      });
    });
  });

  describe('when invoked with an invalid request object, it rejects with a validation error', function () {
    beforeEach(function () {
      errResponse = stub().returns({ message: VALIDATION_ERROR_MSG });
      successResponse = stub().returns({});
      engine = generateCreateEngineStubs().validationError;
      promise = createUser(
        req, res, db, engine, validator, ValidationError, errResponse, successResponse,
      );
    });

    describe('should call errResponse()', function () {
      it('once', function () {
        assert(errResponse.calledOnce);
      });

      it('with res, 400 and message arguments', function () {
        assert(errResponse.calledWithExactly(res, 400, VALIDATION_ERROR_MSG));
      });

      it('should return a validtion error message as the response', async function () {
        const result = await promise;
        assert.strictEqual(result.message, VALIDATION_ERROR_MSG);
      });
    });
  });

  describe('when invoked and it throws a generic error', function () {
    beforeEach(function () {
      errResponse = stub().returns({ message: GENERIC_ERROR_MSG });
      successResponse = stub().returns({});
      engine = generateCreateEngineStubs().genericError;
      promise = createUser(
        req, res, db, engine, validator, ValidationError, errResponse, successResponse,
      );
    });

    describe('should call errResponse()', function () {
      it('once', function () {
        assert(errResponse.calledOnce);
      });

      it('with res, 500, and message arguments', function () {
        assert(errResponse.calledWithExactly(res, 500, GENERIC_ERROR_MSG));
      });

      it('should return a generic error message as the response', async function () {
        const result = await promise;
        assert.strictEqual(result.message, GENERIC_ERROR_MSG);
      });
    });
  });
});
