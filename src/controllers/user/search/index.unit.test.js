import assert from 'assert';
import { stub } from 'sinon';

import ValidationError from '../../../errors/validation-error';
import generateSearchEngineStubs, { RESOLVED_USERS, GENERIC_ERROR, VALIDATION_ERROR_MSG } from '../../../tests/stubs/engines/user/search';
import generateResSpy from '../../../tests/spies/res';
import searchUser from '.';

describe('searchUser controller functionality', function () {
  const req = {};
  const db = {};
  const dbQueryParams = {};
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
      errResponse = stub().returns({});
      successResponse = stub().returns({});
      engine = generateSearchEngineStubs().success;
      return searchUser(
        req, res, db, engine, validator,
        ValidationError, errResponse, successResponse, dbQueryParams,
      );
    });

    describe('should call the search engine function', function () {
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
      successResponse = stub().returns(RESOLVED_USERS);
      engine = generateSearchEngineStubs().success;
      promise = searchUser(
        req, res, db, engine, validator,
        ValidationError, errResponse, successResponse, dbQueryParams,
      );
    });

    describe('should call successResponse()', function () {
      it('once', function () {
        assert(successResponse.calledOnce);
      });
      it('with all the required arguments', function () {
        assert(successResponse.calledWithExactly(res, 200, RESOLVED_USERS, 'application/json', false));
      });

      it('should return an array of user objects as the response', async function () {
        const result = await promise;
        assert.strictEqual(result, RESOLVED_USERS);
      });
    });
  });

  describe('when invoked with an invalid search query and it rejects', function () {
    beforeEach(function () {
      errResponse = stub().returns({ message: VALIDATION_ERROR_MSG });
      successResponse = stub().returns({});
      engine = generateSearchEngineStubs().validationError;
      promise = searchUser(
        req, res, db, engine, validator,
        ValidationError, errResponse, successResponse, dbQueryParams,
      );
    });

    describe('it should call errResponse()', function () {
      it('once', function () {
        assert(errResponse.calledOnce);
      });
      it('with res, 404 and message', function () {
        assert(errResponse.calledWithExactly(res, 400, VALIDATION_ERROR_MSG));
      });

      it('should return a validation error message as the response', async function () {
        const result = await promise;
        assert.strictEqual(result.message, VALIDATION_ERROR_MSG);
      });
    });
  });

  describe('when invoked and throws a generic error', function () {
    beforeEach(function () {
      errResponse = stub().returns({ message: GENERIC_ERROR.message });
      successResponse = stub().returns({});
      engine = generateSearchEngineStubs().genericError;
      promise = searchUser(
        req, res, db, engine, validator,
        ValidationError, errResponse, successResponse, dbQueryParams,
      );
    });

    describe('should call errResponse()', function () {
      it('once', function () {
        assert(errResponse.calledOnce);
      });
      it('with res, 500 and message arguments', function () {
        assert(errResponse.calledWithExactly(res, 500, GENERIC_ERROR.message));
      });

      it('should return a generic error message as the response', async function () {
        const result = await promise;
        assert.strictEqual(result.message, GENERIC_ERROR.message);
      });
    });
  });
});
