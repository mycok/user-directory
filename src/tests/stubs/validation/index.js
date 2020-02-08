import { stub } from 'sinon';

import ValidationError from '../../../errors/validation-error';

const VALIDATION_ERROR_MESSAGE = 'VALIDATION_ERROR_MESSAGE';
const VALIDATION_ERROR = new ValidationError(VALIDATION_ERROR_MESSAGE);

const generateValidatorStubs = () => ({
  valid: stub().returns(true),
  invalid: stub().returns(VALIDATION_ERROR),
});

export {
  generateValidatorStubs as default,
  VALIDATION_ERROR,
  VALIDATION_ERROR_MESSAGE,
};
