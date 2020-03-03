import { stub } from 'sinon';

import ValidationError from '../../../../../errors/validation-error';

const RESOLVED_USERS = [{
  _source: {
    email: 'e@ma.il',
  },
}];

const GENERIC_ERROR_MSG = 'Internal server error';
const GENERIC_ERROR = new Error(GENERIC_ERROR_MSG);
const VALIDATION_ERROR_MSG = 'field validation error';
const VALIDATION_ERROR = new ValidationError(VALIDATION_ERROR_MSG);
const generateSearchEngineStubs = () => ({
  success: stub().resolves(RESOLVED_USERS),
  validationError: stub().rejects(VALIDATION_ERROR),
  genericError: stub().rejects(GENERIC_ERROR),
});

export {
  generateSearchEngineStubs as default,
  RESOLVED_USERS,
  GENERIC_ERROR,
  VALIDATION_ERROR,
};
