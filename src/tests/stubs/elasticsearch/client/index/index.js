import { stub } from 'sinon';

const INDEX_RESOLVED_ID = 'INDEX_RESOLVED_ID';
const INDEX_RESOLVED_OBJ = {
  result: 'created',
  _id: INDEX_RESOLVED_ID,
};

const GENERIC_ERROR = new Error('Internal server error');

const generateGetClientStubs = {
  success() {
    return stub().returns(Promise.resolve(INDEX_RESOLVED_OBJ));
  },
  genericError() {
    return stub().returns(Promise.reject(GENERIC_ERROR));
  },
};

export {
  generateGetClientStubs as default,
  INDEX_RESOLVED_OBJ,
  GENERIC_ERROR,
};
