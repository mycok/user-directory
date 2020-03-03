import assert from 'assert';
import { compareSync } from 'bcryptjs';

import ValidationError from '../../errors/validation-error';
import validate from '../../validators/user/create/validate';
import dbQueryParams from '../../database/dbQueryParams';
import db from '../../database/elasticsearch-setup';
import hashPassword from '../../utils/hashPassword';
import login from '.';

describe('login engine integration', function () {
  let promise;
  let req;
  const USER_ID = 'USER_ID';
  const sign = {};

  describe('when invoked with an invalid request', function () {
    this.beforeEach(function () {
      req = {
        body: {},
      };
      promise = login(req, db, validate, ValidationError, dbQueryParams, compareSync, sign);
    });

    it('should call validate() which should return a validation error', function () {
      return promise.catch((err) => assert(err instanceof ValidationError));
    });
  });

  describe('when invoked with a valid request', function () {
    this.beforeAll(function () {
      req = {
        body: {
          email: 'some@now.il',
          password: 'pasSwOrd#53',
        },
      };
      const password = hashPassword(req.body.password);

      promise = db.index({
        index: process.env.ELASTICSEARCH_INDEX,
        type: 'user',
        id: USER_ID,
        body: { ...req.body, password, searchTerm: req.body.email.replace(/[^\w-]/gi, '').trim() },
        refresh: true,
      })
        .then(() => login(req, db, validate, ValidationError, dbQueryParams, compareSync, sign));
      return promise;
    });

    this.afterAll(async function () {
      await db.delete({
        index: process.env.ELASTICSEARCH_INDEX,
        type: 'user',
        id: USER_ID,
      });
    });

    it('should resolve with a user token', async function () {
      const token = await promise;
      assert.equal(typeof token, 'string');
    });
  });

  describe('when invoked with a wrong password', function () {
    this.beforeAll(function () {
      req = {
        body: {
          email: 'some@now.il',
          password: 'pasSwOrd#53',
        },
      };

      promise = db.index({
        index: process.env.ELASTICSEARCH_INDEX,
        type: 'user',
        id: USER_ID,
        body: { ...req.body, searchTerm: req.body.email.replace(/[^\w-]/gi, '').trim() },
        refresh: true,
      })
        .catch(() => login(req, db, validate, ValidationError, dbQueryParams, compareSync, sign));
    });

    this.afterAll(async function () {
      await db.delete({
        index: process.env.ELASTICSEARCH_INDEX,
        type: 'user',
        id: USER_ID,
      });
    });

    it('should reject with an Invalid password err', function () {
      return promise.catch((err) => assert(err instanceof Error));
    });
    it('containing an Invalid password error message', function () {
      return promise.catch((err) => assert.deepEqual(err.message, 'Invalid password'));
    });
  });

  describe('when invoked with an email that doesnot exist', function () {
    this.beforeAll(function () {
      req = {
        body: {
          email: 'some@now.il',
          password: 'pasSwOrd#53',
        },
      };

      promise = db.index({
        index: process.env.ELASTICSEARCH_INDEX,
        type: 'user',
        id: USER_ID,
        body: req.body,
        refresh: true,
      })
        .catch(() => login(req, db, validate, ValidationError, dbQueryParams, compareSync, sign));
    });

    this.afterAll(async function () {
      await db.delete({
        index: process.env.ELASTICSEARCH_INDEX,
        type: 'user',
        id: USER_ID,
      });
    });

    it('should reject with an Not Found err', function () {
      return promise.catch((err) => assert(err instanceof Error));
    });
    it('containing an Not Found error message', function () {
      return promise.catch((err) => assert.deepEqual(err.message, 'Not Found'));
    });
  });
});
