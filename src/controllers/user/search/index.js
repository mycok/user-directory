function searchUsers(
  req, res, db,
  ...[engine, validator, ValidationError, errResponse, successResponse, dbQueryParams]
) {
  return engine(req, db, validator, ValidationError, dbQueryParams)
    .then((users) => successResponse(res, 200, users, 'application/json', false))
    .catch((err) => {
      if (err instanceof ValidationError) {
        return errResponse(res, 400, err.message);
      }
      return errResponse(res, 500, err.message);
    });
}

export default searchUsers;
