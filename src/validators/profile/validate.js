import Ajv from 'ajv';

import profileSchema from '../../schemas/user/profile.json';
import generateValidationErrorMessages from '../../errors/error-message';
import ValidationError from '../../errors/validation-error';

function validate(reqData) {
  const ajvValidate = new Ajv().compile(profileSchema);
  const valid = ajvValidate(reqData);

  if (!valid) {
    return new ValidationError(generateValidationErrorMessages(ajvValidate.errors, '.profile'));
  }
  return true;
}

export default validate;
