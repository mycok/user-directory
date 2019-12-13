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

export default validateEmailAddress;
