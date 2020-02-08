import assert from 'assert';
import { spy } from 'sinon';

import errorHandler from '.';
import generateResSpy from '../../tests/spies/res';

function syntaxErrorFactory(constructor = SyntaxError) {
  const error = new constructor();
  error.status = 400;
  error.body = {};
  error.type = 'entity.parse.failed';

  return error;
}

describe('error handler functionality', function () {
  describe('when the error is not an instance of SyntaxError', function () {
    const err = syntaxErrorFactory(Error);
    const req = {};
    const res = {};
    const next = spy();

    errorHandler(err, req, res, next);

    it('should call next() once', function () {
      assert(next.calledOnce);
    });
  });

  describe('when the error is an instance of SyntaxError but the status code is not 400', function () {
    const err = syntaxErrorFactory();
    err.status = 401;
    const req = {};
    const res = {};
    const next = spy();

    errorHandler(err, req, res, next);

    it('should call next() once', function () {
      assert(next.calledOnce);
    });
  });

  describe('when the error is an instance of SyntaxError but lacks the body property', function () {
    const err = syntaxErrorFactory();
    delete err.body;
    const req = {};
    const res = {};
    const next = spy();

    errorHandler(err, req, res, next);

    it('should call next() once', function () {
      assert(next.calledOnce);
    });
  });

  describe('when the error is an instance of SyntaxError but the type is not "entity.parse.failed"', function () {
    const err = syntaxErrorFactory();
    err.type = 'foo';
    const req = {};
    const res = {};
    const next = spy();

    errorHandler(err, req, res, next);

    it('should call next() once', function () {
      assert(next.calledOnce);
    });
  });

  describe('when the error is an instance of SyntaxError with all the required properties', function () {
    let err;
    let req;
    let res;
    let next;
    this.beforeEach(function () {
      err = syntaxErrorFactory();
      req = {};
      res = generateResSpy();
      next = spy();

      errorHandler(err, req, res, next);
    });

    describe('should call status()', function () {
      it('once', function () {
        assert(res.status.calledOnce);
      });

      it('with a status code of 400', function () {
        assert(res.status.calledWithExactly(400));
      });
    });

    describe('should call set()', function () {
      it('once', function () {
        assert(res.set.calledOnce);
      });

      it('with Content-Type and application/json as arguments', function () {
        assert(res.set.calledWithExactly('Content-Type', 'application/json'));
      });
    });

    describe('should call res.json()', function () {
      it('once', function () {
        assert(res.json.calledOnce);
      });

      it('with the correct error message', function () {
        assert(res.json.calledWithExactly({ message: 'Payload should be in JSON format' }));
      });
    });
  });
});
