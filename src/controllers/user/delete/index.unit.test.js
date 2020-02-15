import assert from 'assert';
import { stub } from 'sinon';

import generateResSpy from '../../../tests/spies/res';
import generateDeleteEngineStubs,
{
  RESOLVED_RESPONSE, GENERIC_ERROR_MSG,
}
  from '../../../tests/stubs/engines/user/delete';
import deleteUser from '.';

describe('DeleteUser controller functionality', function () {
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
      engine = generateDeleteEngineStubs().success;

      return deleteUser(
        req, res, db, engine, errResponse,
        successResponse, dbQueryParams, generateErrResponses,
      );
    });

    describe('should call the del engine function', function () {
      it('once', function () {
        assert(engine.calledOnce);
      });

      it('with req, db and dbQueryParams as arguments', function () {
        assert(engine.calledWithExactly(req, db, dbQueryParams));
      });
    });
  });
  describe('when invoked with a valid request object', function () {
    beforeEach(function () {
      errResponse = stub().returns({});
      successResponse = stub().returns(RESOLVED_RESPONSE);
      generateErrResponses = stub().returns(errResponse());
      engine = generateDeleteEngineStubs().success;

      promise = deleteUser(
        req, res, db, engine,
        errResponse, successResponse, dbQueryParams, generateErrResponses,
      );
    });

    describe('should call successResponse()', function () {
      it('once', function () {
        assert(successResponse.calledOnce);
      });
      it('with res, 200, result and content-type arguments', function () {
        assert(successResponse.calledWithExactly(res, 200, RESOLVED_RESPONSE, 'text/plain', false));
      });
      it('should return deleted as the response', async function () {
        const result = await promise;
        assert.strictEqual(result, RESOLVED_RESPONSE);
      });
    });
  });

  describe('when invoked and throws a generic error', function () {
    beforeEach(function () {
      errResponse = stub().returns({ message: GENERIC_ERROR_MSG });
      successResponse = stub().returns({});
      engine = generateDeleteEngineStubs().genericError;
      generateErrResponses = stub().returns(errResponse());

      promise = deleteUser(
        req, res, db, engine, errResponse,
        successResponse, dbQueryParams, generateErrResponses,
      );
    });

    it('should call errResponse() once', function () {
      return promise.catch(() => assert(generateErrResponses.calledOnce));
    });
    it('with res, err and errResponse as arguments', function () {
      return promise.catch((err) => assert(errResponse.calledWithExactly(res, err, errResponse)));
    });

    it('should return a generic error message as the response', async function () {
      const err = await promise;
      assert.strictEqual(err.message, GENERIC_ERROR_MSG);
    });
  });
});
