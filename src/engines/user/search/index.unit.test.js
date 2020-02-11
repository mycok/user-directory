import assert from 'assert';

import ValidationError from '../../../errors/validation-error';
import generateValidatorStubs, { VALIDATION_ERROR } from '../../../tests/stubs/validation';
import generateSearchClientStubs, { ES_SEARCH_RESULTS, GENERIC_ERROR } from '../../../tests/stubs/elasticsearch/client/search';
import search from '.';

const SEARCH_TERM = 'SEARCH_TERM';
const requestFactory = {
  empty() {
    return {
      query: {
        query: '',
      },
    };
  },
  withQuery() {
    return {
      query: {
        query: SEARCH_TERM,
      },
    };
  },
  withNumbers() {
    return {
      query: {
        query: 456363737,
      },
    };
  },
};

describe('search engine functionality', function () {
  let req;
  let db;
  let validator;
  let promise;

  const dbQueryParams = {
    index: process.env.ELASTICSEARCH_INDEX,
    type: 'user',
  };
  describe('when invoked', function () {
    this.beforeEach(function () {
      validator = generateValidatorStubs().valid;
      db = { search: generateSearchClientStubs.success() };
    });

    describe('with an empty search query string', function () {
      this.beforeEach(function () {
        req = requestFactory.empty();
        return search(req, db, validator, ValidationError, dbQueryParams);
      });

      it('should call the client instance search method with the correct params', function () {
        assert.deepEqual(db.search.getCall(0).args[0], {
          index: process.env.ELASTICSEARCH_INDEX,
          type: 'user',
          _source_excludes: 'digest',
        });
      });
    });

    describe('with a valid query string', function () {
      this.beforeEach(function () {
        req = requestFactory.withQuery();
        return search(req, db, validator, ValidationError, dbQueryParams);
      });

      it('should caall the client instance search method with correct params', function () {
        assert.deepEqual(db.search.getCall(0).args[0], {
          index: process.env.ELASTICSEARCH_INDEX,
          type: 'user',
          q: SEARCH_TERM,
          _source_excludes: 'digest',
        });
      });
    });

    describe('and the search operation is successful', function () {
      this.beforeEach(function () {
        req = requestFactory.withQuery();
        promise = search(req, db, validator, ValidationError, dbQueryParams);
        return promise;
      });

      it('should return a promise that resolves to an array of objects', async function () {
        const users = await promise;
        assert.deepEqual(users, ES_SEARCH_RESULTS.hits.hits.map((hit) => hit._source));
      });
    });

    describe('and the search operation is unsuccessful', function () {
      this.beforeEach(function () {
        req = requestFactory.withQuery();
        db = {
          search: generateSearchClientStubs.genericError(),
        };
        promise = search(req, db, validator, ValidationError, dbQueryParams);
      });

      it('should return a promise that rejects with a generic error', function () {
        return promise.catch((err) => assert(err instanceof Error));
      });

      it('with an internal server error messaage', function () {
        return promise.catch((err) => assert(err.message, GENERIC_ERROR.message));
      });
    });

    describe('and validation fails', function () {
      this.beforeEach(function () {
        req = requestFactory.withNumbers();
        validator = generateValidatorStubs().invalid;
        promise = search(req, db, validator, ValidationError, dbQueryParams);
      });

      it('calls validator function once', function () {
        return promise.catch(() => assert(validator.calledOnce));
      });

      it('with query as the only argument', function () {
        return promise.catch(() => assert(validator.calledWithExactly(req.query)));
      });

      it('should reject with a validation error', function () {
        return promise.catch((err) => assert.strictEqual(err, VALIDATION_ERROR));
      });

      it('should not call db.search()', function () {
        return promise.catch(() => assert(db.search.notCalled));
      });
    });
  });
});
