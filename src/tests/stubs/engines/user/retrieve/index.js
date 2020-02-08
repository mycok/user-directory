import { stub } from 'sinon';
import NotFoundError from '../../../elasticsearch/errors/not-found';

const RESOLVED_USER_OBJ = {
  _source: {
    email: 'e@ma.il',
  },
};

const GENERIC_ERROR_MSG = 'Internal server error';
const NOT_FOUND_ERROR = new NotFoundError('Not Found');
const GENERIC_ERROR = new Error(GENERIC_ERROR_MSG);

const generateRetrieveEngineStubs = () => ({
  success: stub().resolves(RESOLVED_USER_OBJ),
  notFound: stub().rejects(NOT_FOUND_ERROR),
  genericError: stub().rejects(GENERIC_ERROR),
});

export {
  generateRetrieveEngineStubs as default,
  RESOLVED_USER_OBJ,
  NOT_FOUND_ERROR,
  GENERIC_ERROR,
};
