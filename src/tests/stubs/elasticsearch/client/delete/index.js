import { stub } from 'sinon';
import NotFoundError from '../../errors/not-found';

const RESOLVED_RESPONSE_OBJ = { result: 'deleted' };
const NOT_FOUND_ERROR = new NotFoundError('Not Found');
const GENERIC_ERROR = new Error('Internal server error');

const generateDeleteClientStubs = {
  success() {
    return stub().resolves(RESOLVED_RESPONSE_OBJ.result);
  },
  notFound() {
    return stub().returns(Promise.reject(NOT_FOUND_ERROR));
  },
  genericError() {
    return stub().returns(Promise.reject(GENERIC_ERROR));
  },
};

export {
  generateDeleteClientStubs as default,
  RESOLVED_RESPONSE_OBJ,
  NOT_FOUND_ERROR,
  GENERIC_ERROR,
};
