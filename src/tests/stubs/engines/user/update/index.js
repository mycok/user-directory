import { stub } from 'sinon';

import ValidationError from '../../../../../errors/validation-error';

const RESOLVED_RESULT = 'updated';

const GENERIC_ERROR_MSG = 'Internal server error';
const GENERIC_ERROR = new Error(GENERIC_ERROR_MSG);
const VALIDATION_ERROR_MSG = 'field validation error';

const generateUpdateEngineStubs = () => ({
  success: stub().resolves(RESOLVED_RESULT),
  validationError: stub().rejects(new ValidationError(VALIDATION_ERROR_MSG)),
  genericError: stub().rejects(GENERIC_ERROR),
});

export {
  generateUpdateEngineStubs as default,
  RESOLVED_RESULT,
  GENERIC_ERROR,
  GENERIC_ERROR_MSG,
  VALIDATION_ERROR_MSG,
};
