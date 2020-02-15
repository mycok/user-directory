import assert from 'assert';

import generateDeleteClientStubs, { GENERIC_ERROR, RESOLVED_RESPONSE_OBJ }
  from '../../../tests/stubs/elasticsearch/client/delete';
import del from '.';

describe('del engine functionality', function () {
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
    this.beforeAll(function () {
      db = {
        delete: generateDeleteClientStubs.success(),
      };
      return del(req, db, dbQueryParams);
    });

    it('should call db.delete() with the correct params', function () {
      assert.deepEqual(db.delete.getCall(0).args[0], {
        ...dbQueryParams,
        id: req.user._id,
        refresh: true,
      });
    });
  });

  describe('when db.delete() is successful', function () {
    this.beforeEach(function () {
      db = {
        delete: generateDeleteClientStubs.success(),
      };
      promise = del(req, db, dbQueryParams);
    });
    it('should resolve with a deleted text', async function () {
      const result = await promise;
      assert.strictEqual(result, RESOLVED_RESPONSE_OBJ.result);
    });
  });

  describe('when db.delete() throws a generic error', function () {
    this.beforeEach(function () {
      db = {
        delete: generateDeleteClientStubs.genericError(),
      };
      promise = del(req, db, dbQueryParams);
    });

    it('should return a promise that rejects with a generic error', function () {
      return promise.catch((err) => assert(err instanceof Error));
    });
    it('containing an internal server error message', function () {
      return promise.catch((err) => assert.strictEqual(err.message, GENERIC_ERROR.message));
    });
  });
});
