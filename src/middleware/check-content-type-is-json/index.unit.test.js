import assert from 'assert';
import { spy } from 'sinon';

import checkIfContentTypeIsJson from '.';
import generateResSpy from '../../tests/spies/res';

describe('check if content type is "application/json"', function () {
  let req;
  let res;
  let next;

  describe('POST, PUT or PATCH requests', function () {
    (['POST', 'PUT', 'PATCH']).forEach((method) => {
      describe(`when req.method is ${method} and the content-type is application/json`, function () {
        req = {
          method,
          headers: {
            'content-length': '1',
            'content-type': 'application/json',
          },
        };
        res = {};
        next = spy();

        checkIfContentTypeIsJson(req, res, next);
        it('should call next()', function () {
          assert(next.calledOnce);
        });
      });
    });
  });
  describe('for POST, PUT or PATCH requests', function () {
    (['POST', 'PUT', 'PATCH']).forEach((method) => {
      describe(`when req.method is ${method} and the content-type is not application/json`, function () {
        this.beforeEach(function () {
          req = {
            method,
            headers: {
              'content-length': '1',
              'content-type': 'xml',
            },
          };
          res = generateResSpy();
          next = spy();

          checkIfContentTypeIsJson(req, res, next);
        });

        describe('should call res.status()', function () {
          it('once', function () {
            assert(res.status.calledOnce);
          });

          it('with a 415 status code', function () {
            assert(res.status.calledWithExactly(415));
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
            assert(res.json.calledWithExactly({ message: 'The "Content-Type" header property must always be "application/json"' }));
          });
        });

        it('should not call next() at all', function () {
          assert(next.notCalled);
        });
      });
    });
  });
});
