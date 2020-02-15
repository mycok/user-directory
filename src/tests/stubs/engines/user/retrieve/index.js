import { stub } from 'sinon';

const RESOLVED_USER_OBJ = {
  _source: {
    email: 'e@ma.il',
  },
};

const GENERIC_ERROR_MSG = 'Internal server error';
const GENERIC_ERROR = new Error(GENERIC_ERROR_MSG);

const generateRetrieveEngineStubs = () => ({
  success: stub().resolves(RESOLVED_USER_OBJ),
  genericError: stub().rejects(GENERIC_ERROR),
});

export {
  generateRetrieveEngineStubs as default,
  RESOLVED_USER_OBJ,
  GENERIC_ERROR,
  GENERIC_ERROR_MSG,
};
