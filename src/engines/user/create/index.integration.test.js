import assert from 'assert';

import db from '../../../database/elasticsearch-setup';
import dbQueryParams from '../../../database/dbQueryParams';
import ValidationError from '../../../errors/validation-error';
import validate from '../../../validators/user/create/validate';
import hashPassword from '../../../utils/hashPassword';
import create from '.';

describe('create engine integration', function () {
  let req;
  let promise;
  let userId;
  describe('when invoked with a invalid request', function () {
    this.beforeEach(function () {
      req = { body: {} };
      promise = create(req, db, validate, ValidationError, dbQueryParams, hashPassword);
    });

    it('should return a promise that rejects with an instance of ValidationError', function () {
      return promise.catch((err) => assert(err instanceof ValidationError));
    });
  });

  describe('when invoked with a valid request', function () {
    this.beforeAll(function () {
      req = {
        body: {
          email: 'some@now.il',
          password: 'pasSwOrd#53',
          profile: {},
        },
      };
      promise = create(req, db, validate, ValidationError, dbQueryParams, hashPassword);
      return promise;
    });

    this.afterAll(async function () {
      await db.delete({
        index: process.env.ELASTICSEARCH_INDEX,
        type: 'user',
        id: userId,
        refresh: true,
      });
    });

    it('should return a success object containing a user ID', async function () {
      const { result, _id } = await promise;
      userId = _id;
      assert.equal(result, 'created');
      assert.equal(typeof _id, 'string');
    });

    it('should hash the users password by calling the hashPassword()', async function () {
      const { _source } = await db.get(({
        index: process.env.ELASTICSEARCH_INDEX,
        type: 'user',
        id: userId,
      }));

      const digestRegex = '\\$2[aby]?\\$\\d{1,2}\\$[.\\/A-Za-z0-9]{53}$';
      return assert(_source.password.match(digestRegex));
    });
  });
});
