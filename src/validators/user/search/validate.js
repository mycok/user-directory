import Ajv from 'ajv';

import ValidationError from '../../../errors/validation-error';
import generateValidationErrorMessages from '../../../errors/error-message';
import searchUserSchema from '../../../schemas/user/search.json';

function validate(reqData) {
  const ajvValidate = new Ajv().compile(searchUserSchema);
  const valid = ajvValidate(reqData);

  if (!valid) {
    return new ValidationError(generateValidationErrorMessages(ajvValidate.errors));
  }
  return true;
}

export default validate;
