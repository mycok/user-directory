import assert from 'assert';

import ValidationError from '../../../errors/validation-error';
import db from '../../../database/elasticsearch-setup';
import validator from '../../../validators/profile/validate';
import dbQueryParams from '../../../database/dbQueryParams';
import update from '.';

describe('update engine integration', function () {
  let req;
  let promise;

  const USER_ID = 'USER_ID';
  const ORIGINAL_USER_OBJ = {
    email: 'e@ma.il',
    profile: {
      summary: 'test',
      bio: 'test',
    },
  };
  const UPDATED_USER_OBJ = {
    email: 'e@ma.il',
    profile: {
      summary: 'test-update-integration',
      bio: 'test',
    },
  };

  describe('when invoked with an invalid request', function () {
    this.beforeEach(function () {
      req = {
        user: {
          _id: USER_ID,
        },
        body: {
          name: 'test-user',
        },
      };

      promise = update(req, db, validator, ValidationError, dbQueryParams);
    });

    it('should return a promise that rejects with a Validation error', function () {
      return promise.catch((err) => assert(err instanceof ValidationError));
    });

    it('containing a Validation error message', function () {
      return promise.catch((err) => assert.deepEqual(err.message, "The '.profile.name' field must be of type object"));
    });
  });

  describe('when invoked with a valid request, and the update operation is successful', function () {
    this.beforeEach(function () {
      req = {
        user: {
          _id: USER_ID,
        },
        body: {
          summary: 'test-update-integration',
        },
      };

      promise = db.index({
        ...dbQueryParams,
        id: USER_ID,
        body: ORIGINAL_USER_OBJ,
        refresh: true,
      })
        .then(() => update(req, db, validator, ValidationError, dbQueryParams));
      return promise;
    });

    this.afterEach(function () {
      return db.delete({
        ...dbQueryParams,
        id: USER_ID,
      });
    });

    it('should return a promise that resolves with an updated text', function () {
      return promise.then((result) => assert.deepEqual(result, 'updated'));
    });

    it('should have updated the users summary field', function () {
      return db.get({
        ...dbQueryParams,
        id: USER_ID,
      })
        .then(({ _source }) => assert.deepEqual(_source, UPDATED_USER_OBJ));
    });
  });
});
