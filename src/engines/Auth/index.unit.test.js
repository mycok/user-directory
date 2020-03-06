import assert from 'assert';
import { stub } from 'sinon';

import ValidationError from '../../errors/validation-error';
import generateValidatorStubs,
{ VALIDATION_ERROR_MESSAGE } from '../../tests/stubs/validation';
import generateSearchClientStubs,
{ ES_SEARCH_RESULTS, GENERIC_ERROR } from '../../tests/stubs/elasticsearch/client/auth';
import login from '.';

const requestFactory = {
  valid() {
    return {
      body: {
        email: 'test@usermail.com',
        password: 'passWord#99',
      },
    };
  },
  invalid() {
    return {
      body: {
        email: 'testuser.com',
        password: 'passWord#99',
      },
    };
  },
};
describe('login engine functionality', function () {
  let req;
  let db;
  let validator;
  let compareSync;
  let sign;
  let promise;
  const dbQueryParams = {
    index: process.env.ELASTICSEARCH_INDEX,
    type: 'user',
  };

  describe('when invoked with an invalid request', function () {
    this.beforeEach(function () {
      req = requestFactory.invalid();
      validator = generateValidatorStubs().invalid;
      db = {
        search: generateSearchClientStubs.success(),
      };
      promise = login(req, db, validator, ValidationError, dbQueryParams, compareSync, sign);
    });
    it('it should call the validator() once', function () {
      return promise.catch(() => assert(validator.calledOnce));
    });

    it('with req.body as arguments', function () {
      return promise.catch(() => assert(validator.calledWithExactly(req.body)));
    });

    it('which should return a promise that rejects with a validation error', function () {
      return promise.catch((err) => assert(err instanceof ValidationError));
    });

    it('with a validation error message', function () {
      return promise.catch((err) => assert.deepEqual(err.message, VALIDATION_ERROR_MESSAGE));
    });
    it('and should not call db.search()', function () {
      return promise.catch(() => assert(db.search.notCalled));
    });
  });

  describe('when invoked with a valid request', function () {
    describe('should call the validator()', function () {
      this.beforeAll(function () {
        req = requestFactory.valid();
        validator = generateValidatorStubs().valid;
        db = {
          search: generateSearchClientStubs.success(),
        };
        compareSync = stub().returns(true);
        sign = stub().returns('token');

        promise = login(req, db, validator, ValidationError, dbQueryParams, compareSync, sign);
        return promise;
      });

      it('once', function () {
        return promise.then(() => assert(validator.calledOnce));
      });

      it('with req.body as arguments', function () {
        return promise.then(() => assert(validator.calledWithExactly(req.body)));
      });

      it('which should return a promise that resolves with a boolean of true', function () {
        return promise.then((result) => assert(result));
      });

      it('and should continue excution by calling db.search()', function () {
        return promise.then(() => assert(db.search.calledOnce));
      });
    });

    describe('then should call db.search', function () {
      this.beforeEach(function () {
        req = requestFactory.valid();
        validator = generateValidatorStubs().valid;
        db = {
          search: generateSearchClientStubs.success(),
        };
        compareSync = stub().returns(true);
        sign = stub().returns('token');

        promise = login(req, db, validator, ValidationError, dbQueryParams, compareSync, sign);
        return promise;
      });

      it('with all the correct arguments', function () {
        assert.deepEqual(db.search.getCall(0).args[0], {
          ...dbQueryParams,
          body: {
            query: {
              match: {
                searchTerm: req.body.email.replace(/[^\w-]/gi, '').trim(),
              },
            },
          },
          _sourceIncludes: ['email', 'password'],
        });
      });
    });

    describe('and the search operation is successful', function () {
      this.beforeEach(function () {
        req = requestFactory.valid();
        validator = generateValidatorStubs().valid;
        db = {
          search: generateSearchClientStubs.success(),
        };
        compareSync = stub().returns(true);
        sign = stub().returns('token');

        promise = login(req, db, validator, ValidationError, dbQueryParams, compareSync, sign);
        return promise;
      });

      it('should call compareSync() to match passwords', function () {
        assert(compareSync.calledOnce);
      });

      it('with both the provided and hashed passwords and it should return true indicating a match', function () {
        assert(compareSync.calledWithExactly(
          req.body.password, ES_SEARCH_RESULTS.hits.hits[0]._source.password,
        ));
      });

      it('should then call the sign()', function () {
        assert(sign.calledOnce);
      });

      it('with payload and private key as arguments in order to generate a token', function () {
        const payload = { sub: 'GHDTYEUEIEJ' };
        assert(sign.calledWithExactly(
          { sub: ES_SEARCH_RESULTS.hits.hits[0]._id }, process.env.PRIVATE_KEY,
        ));
      });
      it('db.search should resolve with a JWT token', async function () {
        const token = await promise;
        assert.deepEqual(token, 'token');
        assert(typeof token === 'string');
      });
    });

    describe('however if the search operation is unsuccessful because the email doesnot exist', function () {
      this.beforeEach(function () {
        req = requestFactory.valid();
        validator = generateValidatorStubs().valid;
        db = {
          search: generateSearchClientStubs.notFound(),
        };
        compareSync = stub().returns(true);
        sign = stub().returns('token');

        promise = login(req, db, validator, ValidationError, dbQueryParams, compareSync, sign);
      });

      it('should not call compareSync() to match passwords', function () {
        return promise.catch(() => assert(compareSync.notCalled));
      });

      it('should return a promise that rejects with a Not Found error', function () {
        return promise.catch((err) => assert.equal(err.message, 'Not Found'));
      });
    });

    describe('however if the search operation is unsuccessful because of a generic error', function () {
      this.beforeEach(function () {
        req = requestFactory.valid();
        validator = generateValidatorStubs().valid;
        db = {
          search: generateSearchClientStubs.genericError(),
        };
        compareSync = stub().returns(true);
        sign = stub().returns('token');

        promise = login(req, db, validator, ValidationError, dbQueryParams, compareSync, sign);
      });

      it('should not call compareSync() to match passwords', function () {
        return promise.catch(() => assert(compareSync.notCalled));
      });

      it('should return a promise that rejects with a Not Found error', function () {
        return promise.catch((err) => assert.equal(err.message, GENERIC_ERROR.message));
      });
    });

    describe('however if the search operation is unsuccessful because of an invalid Password error', function () {
      this.beforeEach(function () {
        req = requestFactory.valid();
        validator = generateValidatorStubs().valid;
        db = {
          search: generateSearchClientStubs.success(),
        };
        compareSync = stub().returns(false);
        sign = stub().returns('token');

        promise = login(req, db, validator, ValidationError, dbQueryParams, compareSync, sign);
      });

      it('should all compareSync() to match passwords', function () {
        return promise.catch(() => assert(compareSync.calledOnce));
      });

      it('which should return a promise that rejects with an Invalid password error message', function () {
        return promise.catch((err) => assert.equal(err.message, 'Invalid password'));
      });
    });
  });
});
