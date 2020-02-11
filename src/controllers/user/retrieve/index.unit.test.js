import assert from 'assert';
import { stub } from 'sinon';

import generateResSpy from '../../../tests/spies/res';
import generateRetrieveEngineStubs,
{
  RESOLVED_USER_OBJ, NOT_FOUND_ERROR, GENERIC_ERROR_MSG,
}
  from '../../../tests/stubs/engines/user/retrieve';
import retrieveUser from '.';

describe('retrieveUser controller functionality', function () {
  const req = {};
  const db = {};
  const dbQueryParams = {};

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
      engine = generateRetrieveEngineStubs().success;
      return retrieveUser(req, res, db, engine, errResponse, successResponse, dbQueryParams);
    });

    describe('should call the retrieve engine function', function () {
      it('once', function () {
        assert(engine.calledOnce);
      });

      it('with req, db, and dbQueryParama as arguments', function () {
        assert(engine.calledWithExactly(req, db, dbQueryParams));
      });
    });
  });
  describe('when invoked with a valid request object', function () {
    beforeEach(function () {
      errResponse = stub().returns({});
      successResponse = stub().returns(RESOLVED_USER_OBJ);
      engine = generateRetrieveEngineStubs().success;
      promise = retrieveUser(req, res, db, engine, errResponse, successResponse, dbQueryParams);
    });

    describe('should call successResponse()', function () {
      it('once', function () {
        assert(successResponse.calledOnce);
      });
      it('with res, 200, result and content-type arguments', function () {
        assert(successResponse.calledWithExactly(res, 200, RESOLVED_USER_OBJ));
      });

      it('should return a user object as the response', async function () {
        const result = await promise;
        assert.strictEqual(result, RESOLVED_USER_OBJ);
      });
    });
  });

  describe('when invoked with a non existing userId', function () {
    beforeEach(function () {
      errResponse = stub().returns({ message: NOT_FOUND_ERROR.message });
      successResponse = stub().returns({});
      engine = generateRetrieveEngineStubs().notFound;
      promise = retrieveUser(req, res, db, engine, errResponse, successResponse, dbQueryParams);
    });

    describe('it should call errResponse()', function () {
      it('once', function () {
        assert(errResponse.calledOnce);
      });
      it('with res, 404 and message', function () {
        assert(errResponse.calledWithExactly(res, 404, NOT_FOUND_ERROR.message));
      });

      it('should return a not-found error message as the response', async function () {
        const result = await promise;
        assert.strictEqual(result.message, NOT_FOUND_ERROR.message);
      });
    });
  });

  describe('when invoked and throws a generic error', function () {
    beforeEach(function () {
      errResponse = stub().returns({ message: GENERIC_ERROR_MSG });
      successResponse = stub().returns({});
      engine = generateRetrieveEngineStubs().genericError;
      promise = retrieveUser(req, res, db, engine, errResponse, successResponse, dbQueryParams);
    });

    describe('should call errResponse()', function () {
      it('once', function () {
        assert(errResponse.calledOnce);
      });
      it('with res, 500 and message arguments', function () {
        assert(errResponse.calledWithExactly(res, 500, GENERIC_ERROR_MSG));
      });

      it('should return a generic error message as the response', async function () {
        const result = await promise;
        assert.strictEqual(result.message, GENERIC_ERROR_MSG);
      });
    });
  });
});
