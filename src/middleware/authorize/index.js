function authorize(req, res, next) {
  const { user, loggedInUser } = req;

  if (user._id !== loggedInUser._id) {
    return res.status(403).json({ message: 'You are not authorized to perform this action' });
  }
  return next();
}

export default authorize;
