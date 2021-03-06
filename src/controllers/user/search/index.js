function searchUsers(
  req, res, db,
  ...[
    engine, validator, ValidationError, errResponse,
    successResponse, dbQueryParams, generateErrResponses]
) {
  return engine(req, db, validator, ValidationError, dbQueryParams)
    .then((users) => successResponse(res, 200, users))
    .catch((err) => generateErrResponses(res, err, errResponse, ValidationError));
}

export default searchUsers;
