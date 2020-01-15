import Ajv from 'ajv';
import ValidationError from '../../../errors/validation-error';
import generateValidationErrorMessages from '../../../errors/error-message';
import createUserSchema from '../../../schemas/user/create.json';
import profileSchema from '../../../schemas/user/profile.json';

function validate(reqData) {
  const ajvValidate = new Ajv()
    .addFormat('email', /^[\w.+]+@\w+\.\w+$/)
    .addSchema([profileSchema, createUserSchema])
    .compile(createUserSchema);

  const valid = ajvValidate(reqData);
  if (!valid) {
    return new ValidationError(generateValidationErrorMessages(ajvValidate.errors));
  }
  return true;
}

export default validate;
