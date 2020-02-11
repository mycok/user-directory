import assert from 'assert';

import generateRetrieveClientStubs,
{ NOT_FOUND_ERROR, GENERIC_ERROR }
  from '../../../tests/stubs/elasticsearch/client/get';
import retrieve from '.';

describe('retrieve engine functionality', function () {
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
    this.beforeEach(function () {
      db = {
        get: generateRetrieveClientStubs.success(),
      };
      return retrieve(req, db, dbQueryParams);
    });

    it('should call the client instance method with the correct params', function () {
      assert.deepEqual(db.get.getCall(0).args[0], {
        ...dbQueryParams,
        id: req.params.userId,
        _source_excludes: 'digest',
      });
    });
  });
  describe('when client.get() is successful', function () {
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

  describe('when client.get() is unsuccessful because the user does not exist', function () {
    this.beforeEach(function () {
      db = {
        get: generateRetrieveClientStubs.notFound(),
      };
      promise = retrieve(req, db, dbQueryParams);
    });

    it('should reject with a NotFoundError', function () {
      return promise.catch((err) => assert(err instanceof Error));
    });

    it('should contain a Not-Found error message', function () {
      return promise.catch((err) => assert(err.message === NOT_FOUND_ERROR.message));
    });
  });

  describe('when client.get() throws a generic error', function () {
    this.beforeEach(function () {
      db = {
        get: generateRetrieveClientStubs.genericError(),
      };
      promise = retrieve(req, db, dbQueryParams);
    });

    it('should reject with a generic error', function () {
      return promise.catch((err) => assert(err instanceof Error));
    });
    it('should reject with an internal server error message', function () {
      return promise.catch((err) => assert.strictEqual(err.message, GENERIC_ERROR.message));
    });
  });
});
