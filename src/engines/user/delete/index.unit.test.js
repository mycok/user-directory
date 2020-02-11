import assert from 'assert';

import generateDeleteClientStubs,
{ NOT_FOUND_ERROR, GENERIC_ERROR, RESOLVED_RESPONSE_OBJ }
  from '../../../tests/stubs/elasticsearch/client/delete';
import del from '.';

describe('del engine functionality', function () {
  let db;
  let promise;
  const req = {
    params: { userId: 's_FhGnAB-xEYn9oELjj_' },
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

    it('should call the client delete method with the correct params', function () {
      assert.deepEqual(db.delete.getCall(0).args[0], {
        ...dbQueryParams,
        id: req.params.userId,
        refresh: true,
      });
    });
  });

  describe('when client.delete() is successful', function () {
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

  describe('when client.delete() is unsuccessful because the user does not exist', function () {
    this.beforeEach(function () {
      db = {
        delete: generateDeleteClientStubs.notFound(),
      };
      promise = del(req, db, dbQueryParams);
    });

    it('should return a promise that rejects with a NotFoundError', function () {
      return promise.catch((err) => assert(err instanceof Error));
    });

    it('should contain a Not-Found error message', function () {
      return promise.catch((err) => assert(err.message === NOT_FOUND_ERROR.message));
    });
  });

  describe('when client.get() throws a generic error', function () {
    this.beforeEach(function () {
      db = {
        delete: generateDeleteClientStubs.genericError(),
      };
      promise = del(req, db, dbQueryParams);
    });

    it('should return a promise that rejects with a generic error', function () {
      return promise.catch((err) => assert(err instanceof Error));
    });
    it('should reject with an internal server error message', function () {
      return promise.catch((err) => assert.strictEqual(err.message, GENERIC_ERROR.message));
    });
  });
});
