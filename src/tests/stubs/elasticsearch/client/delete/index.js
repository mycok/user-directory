import { stub } from 'sinon';

const RESOLVED_RESPONSE_OBJ = { result: 'deleted' };
const GENERIC_ERROR = new Error('Internal server error');

const generateDeleteClientStubs = {
  success() {
    return stub().resolves(RESOLVED_RESPONSE_OBJ);
  },
  genericError() {
    return stub().returns(Promise.reject(GENERIC_ERROR));
  },
};

export {
  generateDeleteClientStubs as default,
  RESOLVED_RESPONSE_OBJ,
  GENERIC_ERROR,
};
