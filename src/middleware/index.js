function checkForEmptyPayload(req, res, next) {
  if (
    ['POST', 'PUT', 'PATCH'].includes(req.method)
        && req.headers['content-length'] === '0'
  ) {
    return res
      .status(400)
      .set('Content-Type', 'application/json')
      .json({ message: 'Payload should not be empty' });
  }
  return next();
}

function checkIfContentTypeIsSet(req, res, next) {
  if (
    req.headers['content-length']
        && req.headers['content-length'] !== '0'
        && !req.headers['content-type']
  ) {
    return res
      .status(400)
      .set('Content-Type', 'application/json')
      .json({ message: 'The "Content-Type" header property must be set for requests with a non empty payload' });
  }
  return next();
}

function checkIfContentTypeIsJson(req, res, next) {
  if (!req.headers['content-type'].includes('application/json')) {
    return res
      .status(415)
      .set('Content-Type', 'application/json')
      .json({ message: 'The "Content-Type" header property must always be "application/json"' });
  }
  return next();
}

function checkForRequiredFields(req, res, next) {
  if (
    !Object.prototype.hasOwnProperty.call(req.body, 'email')
    || !Object.prototype.hasOwnProperty.call(req.body, 'password')
  ) {
    return res
      .status(400)
      .set('Content-Type', 'application/json')
      .json({ message: 'Payload must contain atleast an email and password fields' });
  }
  return next();
}

function checkRequiredFieldsTypes(req, res, next) {
  const { body: { email, password } } = req;
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res
      .status(400)
      .set('Content-Type', 'application/json')
      .json({ message: 'The email and password fields must be of type string' });
  }
  return next();
}

function validateEmailAddress(req, res, next) {
  const { body: { email } } = req;
  const re = /^[\w.+]+@\w+\.\w+$/;
  if (!re.test(email)) {
    return res
      .status(400)
      .set('Content-Type', 'application/json')
      .json({ message: 'Please provide a valid email address' });
  }
  return next();
}

function validatePassword(req, res, next) {
  const { body: { password } } = req;
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
  if (!re.test(password)) {
    return res
      .status(400)
      .set('Content-Type', 'application/json')
      .json({ message: 'A password should contain atleast 8 characters with a lowercase, uppercase, a number and a special character' });
  }
  return next();
}

export {
  checkForEmptyPayload,
  checkIfContentTypeIsSet,
  checkIfContentTypeIsJson,
  checkForRequiredFields,
  checkRequiredFieldsTypes,
  validateEmailAddress,
  validatePassword,
};
