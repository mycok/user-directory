import { stub } from 'sinon';

const RESOLVED_RESPONSE = { result: 'deleted' };
const GENERIC_ERROR_MSG = 'Internal server error';
const GENERIC_ERROR = new Error(GENERIC_ERROR_MSG);

const generateDeleteEngineStubs = () => ({
  success: stub().resolves(RESOLVED_RESPONSE),
  genericError: stub().rejects(GENERIC_ERROR),
});

export {
  generateDeleteEngineStubs as default,
  RESOLVED_RESPONSE,
  GENERIC_ERROR,
  GENERIC_ERROR_MSG,
};
