import assert from 'assert';
import { stub } from 'sinon';

import generateResSpy from '../../../tests/spies/res';
import generateDeleteEngineStubs,
{
  RESOLVED_RESPONSE, NOT_FOUND_ERROR, GENERIC_ERROR_MSG,
}
  from '../../../tests/stubs/engines/user/delete';
import deleteUser from '.';

describe('DeleteUser controller functionality', function () {
  const req = {};
  const db = {};

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
      engine = generateDeleteEngineStubs().success;
      return deleteUser(req, res, db, engine, errResponse, successResponse);
    });

    describe('should call the del engine function', function () {
      it('once', function () {
        assert(engine.calledOnce);
      });

      it('with req, and db as arguments', function () {
        assert(engine.calledWithExactly(req, db));
      });
    });
  });
  describe('when invoked with a valid request object', function () {
    beforeEach(function () {
      errResponse = stub().returns({});
      successResponse = stub().returns(RESOLVED_RESPONSE);
      engine = generateDeleteEngineStubs().success;
      promise = deleteUser(req, res, db, engine, errResponse, successResponse);
    });

    describe('should call successResponse()', function () {
      it('once', function () {
        assert(successResponse.calledOnce);
      });
      it('with res, 200, result and content-type arguments', function () {
        assert(successResponse.calledWithExactly(res, 200, RESOLVED_RESPONSE.result, 'text/plain'));
      });
      it('should return deleted as the response', async function () {
        const result = await promise;
        assert.strictEqual(result, RESOLVED_RESPONSE);
      });
    });
  });

  describe('when invoked with a non existing userId', function () {
    beforeEach(function () {
      errResponse = stub().returns({ message: NOT_FOUND_ERROR.message });
      successResponse = stub().returns({});
      engine = generateDeleteEngineStubs().notFound;
      promise = deleteUser(req, res, db, engine, errResponse, successResponse);
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
      engine = generateDeleteEngineStubs().genericError;
      promise = deleteUser(req, res, db, engine, errResponse, successResponse);
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
