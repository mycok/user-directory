function createUser(
  req,
  res,
  db,
  ...[engine, validator, ValidationError, errResponse, successResponse]
) {
  return engine(req, db, validator, ValidationError)
    .then((result) => successResponse(res, 201, result._id, 'text/plain'))
    .catch((err) => {
      if (err instanceof ValidationError) {
        return errResponse(res, 400, err.message);
      }
      return errResponse(res, 500, 'Internal server error');
    });
}

export default createUser;
