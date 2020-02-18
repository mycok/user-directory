import assert from 'assert';

import ValidationError from '../../../errors/validation-error';
import db from '../../../database/elasticsearch-setup';
import validator from '../../../validators/profile/validate';
import dbQueryParams from '../../../database/dbQueryParams';
import replace from '.';

describe('replace engine integration', function () {
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

      promise = replace(req, db, validator, ValidationError, dbQueryParams);
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
        .then(() => replace(req, db, validator, ValidationError, dbQueryParams));
      return promise;
    });

    this.afterEach(async function () {
      await db.delete({
        ...dbQueryParams,
        id: USER_ID,
      });
    });

    it('should return a promise that resolves with an updated text', function () {
      return promise.then((result) => assert.deepEqual(result, 'updated'));
    });

    it('should have replaced the entire user profile with the passed profile properties', function () {
      return db.get({
        ...dbQueryParams,
        id: USER_ID,
      })
        .then(({ _source }) => assert.deepEqual(_source, UPDATED_USER_OBJ));
    });
  });
});
