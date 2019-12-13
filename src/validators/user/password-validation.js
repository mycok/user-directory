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

export default validatePassword;
