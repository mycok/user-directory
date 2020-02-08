import { stub } from 'sinon';
import NotFoundError from '../../errors/not-found';

const RESOLVED_USER_OBJ = {
  _source: {
    email: 'e@ma.il',
  },
};
const NOT_FOUND_ERROR = new NotFoundError('Not Found');
const GENERIC_ERROR = new Error('Internal server error');

const generateRetrieveClientStubs = {
  success() {
    return stub().returns(Promise.resolve(RESOLVED_USER_OBJ));
  },
  notFound() {
    return stub().returns(Promise.reject(NOT_FOUND_ERROR));
  },
  genericError() {
    return stub().returns(Promise.reject(GENERIC_ERROR));
  },
};

export {
  generateRetrieveClientStubs as default,
  RESOLVED_USER_OBJ,
  NOT_FOUND_ERROR,
  GENERIC_ERROR,
};
