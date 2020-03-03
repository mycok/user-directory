import assert from 'assert';
import { stub } from 'sinon';

import ValidationError from '../../errors/validation-error';
import generateLoginEngineStubs,
{
  RESOLVED_TOKEN, GENERIC_ERROR, VALIDATION_ERROR_MSG,
  NOT_FOUND_ERROR, INVALID_PASSWORD_ERROR, VALIDATION_ERROR,
}
  from '../../tests/stubs/engines/auth';
import generateResSpy from '../../tests/spies/res';
import userLogin from '.';

describe('userLogin controller functionality', function () {
  const req = {};
  const db = {};
  const dbQueryParams = {};
  const validator = {};
  const compareSync = {};
  const sign = {};

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
      engine = generateLoginEngineStubs().success;

      return userLogin(
        req, res, db, engine, validator,
        ValidationError, errResponse, successResponse,
        dbQueryParams, generateErrResponses, compareSync, sign,
      );
    });

    describe('should call the login engine function', function () {
      it('once', function () {
        assert(engine.calledOnce);
      });

      it('with req, db, validator, and dbQueryParams as arguments', function () {
        assert(
          engine.calledWithExactly(
            req, db, validator, ValidationError, dbQueryParams, compareSync, sign,
          ),
        );
      });
    });
  });
  describe('when invoked with a valid request object', function () {
    beforeEach(function () {
      errResponse = stub().returns({});
      successResponse = stub().returns(RESOLVED_TOKEN);
      generateErrResponses = stub().returns(errResponse());
      engine = generateLoginEngineStubs().success;

      promise = userLogin(
        req, res, db, engine, validator,
        ValidationError, errResponse, successResponse,
        dbQueryParams, generateErrResponses, compareSync, sign,
      );
    });

    describe('should call successResponse()', function () {
      it('once', function () {
        assert(successResponse.calledOnce);
      });
      it('with all the required arguments', function () {
        assert(successResponse.calledWithExactly(res, 200, RESOLVED_TOKEN, 'text/plain', false));
      });

      it('should return a user token as the response', async function () {
        const token = await promise;
        assert(typeof token === 'string');
      });
    });
  });

  describe('when invoked and it rejects with a validation error', function () {
    beforeEach(function () {
      errResponse = stub().returns({ message: VALIDATION_ERROR_MSG });
      successResponse = stub().returns({});
      generateErrResponses = stub().returns(errResponse());
      engine = generateLoginEngineStubs().validationError;

      promise = userLogin(
        req, res, db, engine, validator,
        ValidationError, errResponse, successResponse,
        dbQueryParams, generateErrResponses, compareSync, sign,
      );
    });

    describe('it should call generateErrResponses()', function () {
      const err = VALIDATION_ERROR;
      it('once', function () {
        assert(generateErrResponses.calledOnce);
      });
      it('with res, err, errResponse and ValidationError', function () {
        assert(
          generateErrResponses.calledWithExactly(res, err, errResponse, ValidationError),
        );
      });

      it('should return a validation error message as the response', async function () {
        const error = await promise;
        assert.strictEqual(error.message, VALIDATION_ERROR_MSG);
      });
    });
  });

  describe('when invoked and throws a generic error', function () {
    beforeEach(function () {
      errResponse = stub().returns({ message: GENERIC_ERROR.message });
      successResponse = stub().returns({});
      generateErrResponses = stub().returns(errResponse());
      engine = generateLoginEngineStubs().genericError;

      promise = userLogin(
        req, res, db, engine, validator,
        ValidationError, errResponse, successResponse,
        dbQueryParams, generateErrResponses, compareSync, sign,
      );
    });

    describe('should call generateErrResponses()', function () {
      const err = GENERIC_ERROR;
      it('once', function () {
        assert(generateErrResponses.calledOnce);
      });
      it('with res, 500 and message arguments', function () {
        assert(
          generateErrResponses.calledWithExactly(res, err, errResponse, ValidationError),
        );
      });

      it('should return a generic error message as the response', async function () {
        const error = await promise;
        assert.strictEqual(error.message, GENERIC_ERROR.message);
      });
    });
  });

  describe('when invoked and throws an invalid password error', function () {
    beforeEach(function () {
      errResponse = stub().returns({ message: INVALID_PASSWORD_ERROR.message });
      successResponse = stub().returns({});
      generateErrResponses = stub().returns(errResponse());
      engine = generateLoginEngineStubs().invalidPasswordError;

      promise = userLogin(
        req, res, db, engine, validator,
        ValidationError, errResponse, successResponse,
        dbQueryParams, generateErrResponses, compareSync, sign,
      );
    });

    describe('should call generateErrResponses()', function () {
      const err = INVALID_PASSWORD_ERROR;
      it('once', function () {
        assert(generateErrResponses.calledOnce);
      });
      it('with res, 500 and message arguments', function () {
        assert(
          generateErrResponses.calledWithExactly(res, err, errResponse, ValidationError),
        );
      });

      it('should return a generic error message as the response', async function () {
        const error = await promise;
        assert.strictEqual(error.message, INVALID_PASSWORD_ERROR.message);
      });
    });
  });

  describe('when invoked and throws a Not Found error', function () {
    beforeEach(function () {
      errResponse = stub().returns({ message: NOT_FOUND_ERROR.message });
      successResponse = stub().returns({});
      generateErrResponses = stub().returns(errResponse());
      engine = generateLoginEngineStubs().notFoundError;

      promise = userLogin(
        req, res, db, engine, validator,
        ValidationError, errResponse, successResponse,
        dbQueryParams, generateErrResponses, compareSync, sign,
      );
    });

    describe('should call generateErrResponses()', function () {
      const err = NOT_FOUND_ERROR;
      it('once', function () {
        assert(generateErrResponses.calledOnce);
      });
      it('with res, 500 and message arguments', function () {
        assert(
          generateErrResponses.calledWithExactly(res, err, errResponse, ValidationError),
        );
      });

      it('should return a generic error message as the response', async function () {
        const error = await promise;
        assert.strictEqual(error.message, NOT_FOUND_ERROR.message);
      });
    });
  });
});
