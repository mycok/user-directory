import { genSaltSync, hashSync } from 'bcryptjs';

function hashPassword(password) {
  const salt = genSaltSync(10);
  return hashSync(password, salt);
}

export default hashPassword;
