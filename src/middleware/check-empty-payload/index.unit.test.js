import assert from 'assert';
import deepclone from 'lodash.clonedeep';
import deepEqual from 'lodash.isequal';
import { spy, stub } from 'sinon';

import checkForEmptyPayload from '.';

describe('check content length / payload', function () {
  let req;
  let res;
  let next;
  let clonedRes;
  describe('when req.method is not one of POST, PUT or PATCH', function () {
    req = { method: 'GET' };
    res = {};
    next = spy();
    clonedRes = deepclone(res);
    checkForEmptyPayload(req, res, next);
    it('it should not modify res', function () {
      assert(deepEqual(res, clonedRes));
    });

    it('should call next() once', function () {
      assert(next.calledOnce);
    });
  });

  describe('when the req.method is one of POST, PUT or PATCH', function () {
    (['POST', 'PUT', 'PATCH']).forEach((method) => {
      describe(`when req.method is ${method}`, function () {
        describe('and the content-length header is not "0"', function () {
          req = {
            method,
            headers: {
              'content-length': '1',
            },
          };
          res = {};
          next = spy();
          clonedRes = deepclone(res);
          checkForEmptyPayload(req, res, next);

          it('should not modify res', function () {
            assert(deepEqual(res, clonedRes));
          });

          it('should call next()', function () {
            assert(next.calledOnce);
          });
        });
      });
    });
  });

  describe('when the req.method is one of POST, PUT or PATCH and the content-length header is "0"', function () {
    let jsonResValue;
    let returnedValue;
    (['POST', 'PUT', 'PATCH']).forEach((method) => {
      describe(`when req.method is ${method}`, function () {
        this.beforeEach(function () {
          jsonResValue = {};
          req = {
            method,
            headers: {
              'content-length': '0',
            },
          };
          res = {
            status: spy(),
            set: spy(),
            json: stub().returns(jsonResValue),
          };
          next = spy();
          returnedValue = checkForEmptyPayload(req, res, next);
        });

        describe('should call res.status()', function () {
          it('once', function () {
            assert(res.status.calledOnce);
          });

          it('with a 400 status code', function () {
            assert(res.status.calledWithExactly(400));
          });
        });

        describe('should call res.set()', function () {
          it('once', function () {
            assert(res.set.calledOnce);
          });

          it('with "Content-Type" and "application/json" arguments', function () {
            assert(res.set.calledWithExactly('Content-Type', 'application/json'));
          });
        });

        describe('should call res.json()', function () {
          it('once', function () {
            assert(res.json.calledOnce);
          });

          it('with the correct error object', function () {
            assert(res.json.calledWithExactly({ message: 'Payload should not be empty' }));
          });

          it('should return whatever re.json() returns', function () {
            assert.strictEqual(returnedValue, jsonResValue);
          });
        });

        it('should not call next() at all', function () {
          assert(next.notCalled);
        });
      });
    });
  });
});
