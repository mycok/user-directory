import assert from 'assert';

import generateRetrieveClientStubs, { GENERIC_ERROR }
  from '../../../tests/stubs/elasticsearch/client/get';
import retrieve from '.';

describe('retrieve engine functionality', function () {
  let db;
  let promise;
  const req = {
    user: { _id: 's_FhGnAB-xEYn9oELjj_' },
  };
  const dbQueryParams = {
    index: process.env.ELASTICSEARCH_INDEX,
    type: 'user',
  };

  describe('when invoked', function () {
    this.beforeEach(function () {
      db = {
        get: generateRetrieveClientStubs.success(),
      };
      return retrieve(req, db, dbQueryParams);
    });

    it('should call db.get() with the correct params', function () {
      assert.deepEqual(db.get.getCall(0).args[0], {
        ...dbQueryParams,
        id: req.user._id,
        _source_excludes: ['digest', 'password'],
      });
    });
  });
  describe('when db.get() is successful', function () {
    this.beforeEach(function () {
      db = {
        get: generateRetrieveClientStubs.success(),
      };
      promise = retrieve(req, db, dbQueryParams);
    });
    it('should resolve with a user object', function () {
      return promise.then((result) => assert(typeof result === 'object'));
    });
  });

  describe('when db.get() throws a generic error', function () {
    this.beforeEach(function () {
      db = {
        get: generateRetrieveClientStubs.genericError(),
      };
      promise = retrieve(req, db, dbQueryParams);
    });

    it('should reject with a generic error', function () {
      return promise.catch((err) => assert(err instanceof Error));
    });
    it('containing an internal server error message', function () {
      return promise.catch((err) => assert.strictEqual(err.message, GENERIC_ERROR.message));
    });
  });
});
