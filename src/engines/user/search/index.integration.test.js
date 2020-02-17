import assert from 'assert';

import db from '../../../database/elasticsearch-setup';
import dbQueryParams from '../../../database/dbQueryParams';
import ValidationError from '../../../errors/validation-error';
import validate from '../../../validators/user/search/validate';
import search from '.';

const SEARCH_TERM = 'conquerer';
const USER_ID = 'TEST_USER_ID';
const USER_OBJ = {
  email: 'test@email.com',
  profile: {
    summary: SEARCH_TERM,
  },
};

describe('search engine integration', function () {
  let req;
  let promise;

  describe('when invoked with an invalid request', function () {
    this.beforeEach(function () {
      req = {
        query: {
          query: 25253636,
        },
      };
      promise = search(req, db, validate, ValidationError, dbQueryParams);
    });

    it('should call return a promise that rejects with a validation error', function () {
      return promise.catch((err) => assert(err instanceof ValidationError));
    });
  });

  describe('when invoked with a valid request', function () {
    describe('but there are no users that match the search term', function () {
      this.beforeEach(function () {
        req = {
          query: {
            query: SEARCH_TERM,
          },
        };
        promise = search(req, db, validate, ValidationError, dbQueryParams);
        return promise;
      });

      it('should return a promise that resolves to an array', async function () {
        const users = await promise;
        assert(Array.isArray(users));
      });

      it('should be an empty array', async function () {
        const users = await promise;
        assert.equal(users.length, 0);
      });
    });

    describe('but the search term is an empty string', function () {
      this.beforeEach(function () {
        req = {
          query: {
            query: '',
          },
        };
        promise = search(req, db, validate, ValidationError, dbQueryParams);
        return promise;
      });

      it('should return a promise that resolves to an array', async function () {
        const users = await promise;
        assert(Array.isArray(users));
      });
    });

    describe('and the search is successful', function () {
      this.beforeEach(async function () {
        await db.index({
          index: process.env.ELASTICSEARCH_INDEX,
          type: 'user',
          id: USER_ID,
          body: USER_OBJ,
          refresh: true,
        });
      });

      this.afterEach(async function () {
        await db.delete({
          index: process.env.ELASTICSEARCH_INDEX,
          type: 'user',
          id: USER_ID,
          refresh: true,
        });
      });

      describe('should return all users that match the search term', function () {
        this.beforeEach(function () {
          req = {
            query: {
              query: SEARCH_TERM,
            },
          };
          promise = search(req, db, validate, ValidationError, dbQueryParams);
          return promise;
        });

        it('as a promise that resolves to an array', async function () {
          const users = await promise;
          assert(Array.isArray(users));
        });

        it('which in this case contains a single user object', async function () {
          const users = await promise;
          assert.deepEqual(users[0], USER_OBJ);
        });
      });
    });
  });
});
