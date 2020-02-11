function createUser(
  req, res, db,
  ...[engine, validator, ValidationError, errResponse, successResponse, dbQueryParams]
) {
  return engine(req, db, validator, ValidationError, dbQueryParams)
    .then((result) => successResponse(res, 201, result._id, 'text/plain'))
    .catch((err) => {
      if (err instanceof ValidationError) {
        return errResponse(res, 400, err.message);
      }
      return errResponse(res, 500, err.message);
    });
}

export default createUser;
