import assert from 'assert';

import db from '../../../database/elasticsearch-setup';
import ValidationError from '../../../errors/validation-error';
import validate from '../../../validators/user/create/validate';
import create from '.';

describe('create user engine integration functionality', function () {
  let req;
  let promise;
  describe('when invoked with a invalid request', function () {
    this.beforeEach(function () {
      req = { body: {} };
      promise = create(req, db, validate, ValidationError);
    });

    it('should return a promise that rejects with an instance of ValidationError', function () {
      return promise.catch((err) => assert(err instanceof ValidationError));
    });
  });

  describe('when invoked with a valid request', function () {
    this.beforeEach(function () {
      req = {
        body: {
          email: 'some@now.il',
          password: 'pasSwOrd#53',
          profile: {},
        },
      };

      promise = create(req, db, validate, ValidationError);
    });
    it('should return a success object containing a user ID', function () {
      return promise.then((result) => {
        assert.equal(result.result, 'created');
        assert.equal(typeof result._id, 'string');
      });
    });
  });
});
