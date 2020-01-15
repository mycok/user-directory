import assert from 'assert';
import { stub, spy, match } from 'sinon';

import ValidationError from '../../../errors/validation-error';
import createUser from '.';

const createStubs = {
  success: stub().resolves({ _id: 'foo' }),
  validationError: stub().rejects(new ValidationError('field validation error')),
  genericError: stub().rejects(new Error()),
};

describe('createUser controller functionality', function () {
  describe('when called with a valid request object, it resolves with a user object ID', function (done) {
    beforeEach(function () {
      const req = {};
      this.res = {
        status: spy(),
        set: spy(),
        send: spy(),
      };
      const db = { index: spy() };
      const validator = spy();
      const create = createStubs.success;
      return createUser(req, this.res, db, create, validator, ValidationError)
        .then((result) => { this.result = result; this.error = undefined; })
        .catch((err) => { this.error = err; this.result = undefined; });
    });

    describe('it should call res.status()', function () {
      it('once', function () {
        assert(this.res.status.calledOnce);
      });
      it('with a 201 status code', function () {
        assert(this.res.status.calledWithExactly(201));
      });
    });

    describe('call res.set()', function () {
      it('once', function () {
        assert(this.res.set.calledOnce);
      });

      it('with "Content-Type" and "plain/text" arguments', function () {
        assert(this.res.set.calledWithExactly('Content-Type', 'text/plain'));
      });
    });

    describe('call res.send()', function () {
      it('once', function () {
        assert(this.res.send.calledOnce);
      });

      it('with a user ID result', function () {
        assert(this.res.send.calledWithExactly(this.result));
      });
    });
  });

  describe('when called with an invalid request object, it rejects with an error', function (done) {
    beforeEach(function () {
      const req = {};
      this.res = {
        status: spy(),
        set: spy(),
        send: spy(),
        json: spy(),
      };
      const db = { index: spy() };
      const validator = spy();
      const create = createStubs.validationError;
      return createUser(req, this.res, db, create, validator, ValidationError)
        .then((result) => { this.result = result; this.error = undefined; })
        .catch((err) => { this.error = err; this.result = undefined; });
    });

    describe('it should call res.status()', function () {
      it('once', function () {
        assert(this.res.status.calledOnce);
      });
      it('with a 400 status code', function () {
        assert(this.res.status.calledWithExactly(400));
      });
    });

    describe('call res.set()', function () {
      it('once', function () {
        assert(this.res.set.calledOnce);
      });

      it('with "Content-Type" and "application/json" arguments', function () {
        assert(this.res.set.calledWithExactly('Content-Type', 'application/json'));
      });
    });

    describe('call res.json()', function () {
      it('once', function () {
        assert(this.res.json.calledOnce);
      });

      it('with an error message', function () {
        assert(this.res.json.calledWithExactly(match.has('message', 'field validation error')));
      });
    });
  });

  describe('when createUser controller throws a generic error', function (done) {
    beforeEach(function () {
      const req = {};
      this.res = {
        status: spy(),
        set: spy(),
        send: spy(),
        json: spy(),
      };
      const db = { index: spy() };
      const validator = spy();
      const create = createStubs.genericError;
      return createUser(req, this.res, db, create, validator, ValidationError)
        .then((result) => { this.result = result; this.error = undefined; })
        .catch((err) => { this.error = err; this.result = undefined; });
    });

    describe('it should call res.status()', function () {
      it('once', function () {
        assert(this.res.status.calledOnce);
      });
      it('with a 500 status code', function () {
        assert(this.res.status.calledWithExactly(500));
      });
    });

    describe('call res.set()', function () {
      it('once', function () {
        assert(this.res.set.calledOnce);
      });

      it('with "Content-Type" and "application/json" arguments', function () {
        assert(this.res.set.calledWithExactly('Content-Type', 'application/json'));
      });
    });

    describe('call res.json()', function () {
      it('once', function () {
        assert(this.res.json.calledOnce);
      });

      it('with an error message', function () {
        assert(this.res.json.calledWithExactly(match.has('message', 'Internal Server Error!')));
      });
    });
  });
});
