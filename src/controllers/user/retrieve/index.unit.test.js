import assert from 'assert';
import { stub } from 'sinon';

import generateResSpy from '../../../tests/spies/res';
import generateRetrieveEngineStubs,
{
  RESOLVED_USER_OBJ, GENERIC_ERROR_MSG,
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
  let generateErrResponses;
  let promise;

  beforeEach(function () {
    res = generateResSpy();
  });

  describe('when invoked', function () {
    beforeEach(function () {
      errResponse = stub().returns({});
      successResponse = stub().returns({});
      generateErrResponses = stub().returns(errResponse());
      engine = generateRetrieveEngineStubs().success;

      return retrieveUser(
        req, res, db, engine, errResponse,
        successResponse, dbQueryParams, generateErrResponses,
      );
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
      generateErrResponses = stub().returns(errResponse());
      engine = generateRetrieveEngineStubs().success;

      promise = retrieveUser(
        req, res, db, engine, errResponse,
        successResponse, dbQueryParams, generateErrResponses,
      );
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

  describe('when invoked and throws a generic error', function () {
    beforeEach(function () {
      errResponse = stub().returns({ message: GENERIC_ERROR_MSG });
      successResponse = stub().returns({});
      generateErrResponses = stub().returns(errResponse());
      engine = generateRetrieveEngineStubs().genericError;

      promise = retrieveUser(
        req, res, db, engine, errResponse,
        successResponse, dbQueryParams, generateErrResponses,
      );
    });

    describe('should call generateErrResponses()', function () {
      it('once', function () {
        return promise.catch((err) => assert(generateErrResponses.calledOnce));
      });
      it('with res, err and errResponse arguments', function () {
        return promise.catch((err) => assert(
          generateErrResponses.calledWithExactly(res, err, errResponse),
        ));
      });

      it('should return a generic error message as the response', async function () {
        const err = await promise;
        assert.strictEqual(err.message, GENERIC_ERROR_MSG);
      });
    });
  });
});
