import { stub } from 'sinon';
import ValidationError from '../../../../../errors/validation-error';

const CREATE_USER_RESPONSE = {
  _id: 'foo',
  result: 'created',
};
const VALIDATION_ERROR_MSG = 'field validation error';
const GENERIC_ERROR_MSG = 'Internal server error';

const generateCreateEngineStubs = () => ({
  success: stub().resolves(CREATE_USER_RESPONSE),
  validationError: stub().rejects(new ValidationError(VALIDATION_ERROR_MSG)),
  genericError: stub().rejects(new Error(GENERIC_ERROR_MSG)),
});

export {
  generateCreateEngineStubs as default,
  VALIDATION_ERROR_MSG,
  GENERIC_ERROR_MSG,
  CREATE_USER_RESPONSE,
};
