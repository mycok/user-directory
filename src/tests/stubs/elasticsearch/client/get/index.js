import { stub } from 'sinon';

const RESOLVED_USER_OBJ = {
  _source: {
    email: 'e@ma.il',
  },
};

const GENERIC_ERROR = new Error('Internal server error');

const generateRetrieveClientStubs = {
  success() {
    return stub().resolves(RESOLVED_USER_OBJ);
  },
  genericError() {
    return stub().returns(Promise.reject(GENERIC_ERROR));
  },
};

export {
  generateRetrieveClientStubs as default,
  RESOLVED_USER_OBJ,
  GENERIC_ERROR,
};
