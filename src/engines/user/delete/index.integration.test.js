import assert from 'assert';

import db from '../../../database/elasticsearch-setup';
import dbQueryParams from '../../../database/dbQueryParams';
import del from '.';

const USER_ID = 's_FhGnAB-xEYn9oELjj_';
const USER_OBJ = {
  email: 'e@ma.il',
};
const RESOLVED_RESPONSE_OBJECT = { result: 'deleted' };

describe('del engine integration', function () {
  const req = {
    params: { userId: USER_ID },
  };
  let promise;
  describe('when the user to be deleted does not exist', function () {
    this.beforeEach(function () {
      promise = del(req, db, dbQueryParams);
    });

    it('should return a promise that rejects with a not-found error', function () {
      return promise.catch((err) => assert(err instanceof Error));
    });

    it('should contain a not-found error message', function () {
      return promise.catch((err) => assert(err.message === 'Not Found'));
    });
  });

  describe('when the user to be deleted exists', function () {
    this.beforeEach(function () {
      promise = db.index({
        index: process.env.ELASTICSEARCH_INDEX,
        type: 'user',
        id: USER_ID,
        body: USER_OBJ,
        refresh: true,
      })
        .then(() => del(req, db, dbQueryParams));

      return promise;
    });

    describe('and the delete operation is successful', function () {
      it('should return a promise that resolves', function () {
        return promise.then(() => assert(true));
      });

      it('to an object with a result property', function () {
        return promise.then(
          (result) => assert.equal(result.result, RESOLVED_RESPONSE_OBJECT.result),
        );
      });
    });
  });
});
