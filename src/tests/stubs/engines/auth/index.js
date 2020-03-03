import { stub } from 'sinon';

import ValidationError from '../../../../errors/validation-error';

const RESOLVED_TOKEN = 'token';
const GENERIC_ERROR_MSG = 'Internal server error';
const GENERIC_ERROR = new Error(GENERIC_ERROR_MSG);
const VALIDATION_ERROR_MSG = 'field validation error';
const INVALID_PASSWORD_ERROR = new Error('Invalid password');
const NOT_FOUND_ERROR = new Error('Not Found');
const VALIDATION_ERROR = new ValidationError(VALIDATION_ERROR_MSG);

const generateLoginEngineStubs = () => ({
  success: stub().resolves(RESOLVED_TOKEN),
  validationError: stub().rejects(VALIDATION_ERROR),
  invalidPasswordError: stub().rejects(INVALID_PASSWORD_ERROR),
  notFoundError: stub().rejects(NOT_FOUND_ERROR),
  genericError: stub().rejects(GENERIC_ERROR),
});

export {
  generateLoginEngineStubs as default,
  RESOLVED_TOKEN,
  GENERIC_ERROR,
  GENERIC_ERROR_MSG,
  VALIDATION_ERROR_MSG,
  NOT_FOUND_ERROR,
  INVALID_PASSWORD_ERROR,
  VALIDATION_ERROR,
};
