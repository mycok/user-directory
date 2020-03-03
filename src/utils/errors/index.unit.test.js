import assert from 'assert';
import { stub } from 'sinon';

import ValidationError from '../../errors/validation-error';
import generateErrResponse from '.';

describe('controller error handler functionality', function () {
  const res = {};
  let err;
  let errResponse;

  describe('when invoked with a Validation error', function () {
    this.beforeEach(function () {
      err = new ValidationError('Invalid field type');
      errResponse = stub().returns({ message: err.message });

      return generateErrResponse(res, err, errResponse, ValidationError);
    });

    it('should call errResponse() once', function () {
      assert(errResponse.calledOnce);
    });

    it('with all the required arguments', function () {
      assert(errResponse.calledWithExactly(res, 400, err.message));
    });
  });

  describe('when invoked with a GENERIC error', function () {
    this.beforeEach(function () {
      err = new Error('Internal server error');
      errResponse = stub().returns({ message: err.message });

      return generateErrResponse(res, err, errResponse);
    });

    it('should call errResponse() once', function () {
      assert(errResponse.calledOnce);
    });

    it('with all the required arguments', function () {
      assert(errResponse.calledWithExactly(res, 500, err.message));
    });
  });

  describe('when invoked with a Not Found error', function () {
    this.beforeEach(function () {
      err = new Error('Not Found');
      errResponse = stub().returns({ message: err.message });

      return generateErrResponse(res, err, errResponse);
    });

    it('should call errResponse() once', function () {
      assert(errResponse.calledOnce);
    });

    it('with all the required arguments', function () {
      assert(errResponse.calledWithExactly(res, 404, err.message));
    });
  });

  describe('when invoked with an Invalid Password error', function () {
    this.beforeEach(function () {
      err = new Error('Invalid password');
      errResponse = stub().returns({ message: err.message });

      return generateErrResponse(res, err, errResponse);
    });

    it('should call errResponse() once', function () {
      assert(errResponse.calledOnce);
    });

    it('with all the required arguments', function () {
      assert(errResponse.calledWithExactly(res, 401, err.message));
    });
  });
});
