import assert from 'assert';

import db from '../../../database/elasticsearch-setup';
import dbQueryParams from '../../../database/dbQueryParams';
import retrieve from '.';

const USER_ID = 's_FhGnAB-xEYn9oELjj_';
const RESOLVED_USER_OBJ = {
  email: 'e@ma.il',
};

describe('retrieve engine integration', function () {
  const req = {
    params: { userId: USER_ID },
  };
  let promise;
  describe('when the requested user does not exist', function () {
    this.beforeEach(function () {
      promise = retrieve(req, db, dbQueryParams);
    });

    it('should return a promise that rejects with a not-found error', function () {
      return promise.catch((err) => assert(err instanceof Error));
    });

    it('should contain a not-found error message', function () {
      return promise.catch((err) => assert(err.message === 'Not Found'));
    });
  });

  describe('when the requested user exists', function () {
    this.beforeEach(function () {
      promise = db.index({
        index: process.env.ELASTICSEARCH_INDEX,
        type: 'user',
        id: USER_ID,
        body: RESOLVED_USER_OBJ,
      })
        .then(() => retrieve(req, db, dbQueryParams));

      return promise;
    });

    this.afterEach(() => {
      db.delete({
        index: process.env.ELASTICSEARCH_INDEX,
        type: 'user',
        id: USER_ID,
        refresh: true,
      });
    });

    describe('and the elasticsearch operation is successful', function () {
      it('should return a promise that resolves', function () {
        return promise.then(() => assert(true));
      });

      it('to a user object', function () {
        return promise.then((result) => assert.deepEqual(result, RESOLVED_USER_OBJ));
      });
    });
  });
});
