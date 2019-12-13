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

export default checkForRequiredFields;
