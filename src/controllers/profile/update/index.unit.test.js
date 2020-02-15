import assert from 'assert';
import { stub } from 'sinon';

import ValidationError from '../../../errors/validation-error';
import generateUpdateEngineStubs, { RESOLVED_RESULT, GENERIC_ERROR, VALIDATION_ERROR_MSG } from '../../../tests/stubs/engines/user/update';
import generateResSpy from '../../../tests/spies/res';
import updateUser from '.';

describe('updateUser controller functionality', function () {
  const req = {};
  const db = {};
  const dbQueryParams = {};
  const validator = {};

  let res;
  let engine;
  let successResponse;
  let errResponse;
  let promise;
  let generateErrResponses;

  beforeEach(function () {
    res = generateResSpy();
  });

  describe('when invoked', function () {
    beforeEach(function () {
      errResponse = stub().returns({});
      successResponse = stub().returns({});
      generateErrResponses = stub().returns(errResponse());
      engine = generateUpdateEngineStubs().success;

      promise = updateUser(
        req, res, db, engine, validator,
        ValidationError, errResponse, successResponse, dbQueryParams, generateErrResponses,
      );
    });

    describe('should call the update engine function', function () {
      it('once', function () {
        assert(engine.calledOnce);
      });

      it('with req, db, validator, and dbQueryParams as arguments', function () {
        assert(engine.calledWithExactly(req, db, validator, ValidationError, dbQueryParams));
      });
    });
  });

  describe('when invoked with a valid request object', function () {
    beforeEach(function () {
      errResponse = stub().returns({});
      successResponse = stub().returns(RESOLVED_RESULT);
      generateErrResponses = stub().returns(errResponse());
      engine = generateUpdateEngineStubs().success;

      promise = updateUser(
        req, res, db, engine, validator,
        ValidationError, errResponse, successResponse, dbQueryParams, generateErrResponses,
      );
    });

    describe('should call successResponse()', function () {
      it('once', function () {
        assert(successResponse.calledOnce);
      });
      it('with all the required arguments', function () {
        assert(successResponse.calledWithExactly(res, 200, RESOLVED_RESULT));
      });

      it('should return an updated text as the response', async function () {
        const result = await promise;
        assert.strictEqual(result, RESOLVED_RESULT);
      });
    });
  });

  describe('when invoked with an invalid update fields and it rejects', function () {
    beforeEach(function () {
      errResponse = stub().returns({ message: VALIDATION_ERROR_MSG });
      successResponse = stub().returns({});
      generateErrResponses = stub().returns(errResponse());
      engine = generateUpdateEngineStubs().genericError;

      promise = updateUser(
        req, res, db, engine, validator,
        ValidationError, errResponse, successResponse, dbQueryParams, generateErrResponses,
      );
    });

    describe('it should call generateErrResponses()', function () {
      it('once', function () {
        assert(generateErrResponses.calledOnce);
      });
      it('with res, err, errResponse and ValidationError', function () {
        return promise.catch((err) => assert(
          generateErrResponses.calledWithExactly(res, err, errResponse, ValidationError),
        ));
      });

      it('should return a validation error message as the response', async function () {
        const err = await promise;
        assert.strictEqual(err.message, VALIDATION_ERROR_MSG);
      });
    });
  });

  describe('when invoked and throws a generic error', function () {
    beforeEach(function () {
      errResponse = stub().returns({ message: GENERIC_ERROR.message });
      successResponse = stub().returns({});
      generateErrResponses = stub().returns(errResponse());
      engine = generateUpdateEngineStubs().genericError;

      promise = updateUser(
        req, res, db, engine, validator,
        ValidationError, errResponse, successResponse, dbQueryParams, generateErrResponses,
      );
    });

    describe('should call generateErrResponses()', function () {
      it('once', function () {
        return promise.catch(() => assert(generateErrResponses.calledOnce));
      });
      it('with res, 500 and message arguments', function () {
        return promise.catch((err) => assert(
          generateErrResponses.calledWithExactly(res, err, errResponse, ValidationError),
        ));
      });

      it('should return a generic error message as the response', async function () {
        const err = await promise;
        assert.strictEqual(err.message, GENERIC_ERROR.message);
      });
    });
  });
});
