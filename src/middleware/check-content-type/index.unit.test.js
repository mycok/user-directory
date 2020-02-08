import assert from 'assert';
import { spy, stub } from 'sinon';
import deepClone from 'lodash.clonedeep';
import deepEqual from 'lodash.isequal';

import checkIfContentTypeIsSet from '.';

describe('check if content-type is set', function () {
  let req;
  let res;
  let next;
  describe('when req.method is not one of POST, PUT or PATCH', function () {
    let clonedRes;
    this.beforeEach(function () {
      req = { method: 'GET' };
      res = {};
      next = spy();
      clonedRes = deepClone(res);

      checkIfContentTypeIsSet(req, res, next);
    });

    it('should not modify res', function () {
      assert(deepEqual(res, clonedRes));
    });

    it('should call next()', function () {
      assert(next.calledOnce);
    });
  });

  describe('when the req.method is one of PUT, POST or PATCH', function () {
    (['POST', 'PUT', 'PATCH']).forEach((method) => {
      describe(`and req.method is ${method} but the payload / content-length is 0`, function () {
        let clonedRes;
        this.beforeEach(function () {
          req = {
            method,
            headers: {
              'content-length': '0',
            },
          };
          res = {};
          next = spy();
          clonedRes = deepClone(res);

          checkIfContentTypeIsSet(req, res, next);
        });

        it('should not modify res', function () {
          assert(deepEqual(res, clonedRes));
        });

        it('should call next()', function () {
          assert(next.calledOnce);
        });
      });
    });
  });

  describe('when the req.method is one of POST, PUT or PATCH', function () {
    let jsonResValue;
    let returnedValue;
    (['POST', 'PUT', 'PATCH']).forEach((method) => {
      describe(`req.method is ${method} and the payload / content-length is > 0 but the content-type property is not set`, function () {
        this.beforeEach(function () {
          jsonResValue = {};
          req = {
            method,
            headers: {
              'content-length': '1',
            },
          };
          res = {
            status: spy(),
            set: spy(),
            json: stub().returns(jsonResValue),
            send: spy(),
          };
          next = spy();

          returnedValue = checkIfContentTypeIsSet(req, res, next);
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
            assert(res.json.calledWithExactly({ message: 'The "Content-Type" header property must be set for requests with a non empty payload' }));
          });
        });

        it('should return whatever res.json() returns', function () {
          assert.strictEqual(jsonResValue, returnedValue);
        });

        it('should not call next() at all', function () {
          assert(next.notCalled);
        });
      });
    });
  });
});
