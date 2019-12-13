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

export default checkRequiredFieldsTypes;
