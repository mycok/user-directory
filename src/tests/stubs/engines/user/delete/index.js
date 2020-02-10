import { stub } from 'sinon';
import NotFoundError from '../../../elasticsearch/errors/not-found';

const RESOLVED_RESPONSE = { result: 'deleted' };
const GENERIC_ERROR_MSG = 'Internal server error';
const NOT_FOUND_ERROR = new NotFoundError('Not Found');
const GENERIC_ERROR = new Error(GENERIC_ERROR_MSG);

const generateDeleteEngineStubs = () => ({
  success: stub().resolves(RESOLVED_RESPONSE),
  notFound: stub().rejects(NOT_FOUND_ERROR),
  genericError: stub().rejects(GENERIC_ERROR),
});

export {
  generateDeleteEngineStubs as default,
  RESOLVED_RESPONSE,
  NOT_FOUND_ERROR,
  GENERIC_ERROR,
  GENERIC_ERROR_MSG,
};
