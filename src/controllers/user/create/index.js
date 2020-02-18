function createUser(
  req, res, db,
  ...[
    engine, validator, ValidationError, errResponse,
    successResponse, dbQueryParams, generateErrResponses, hashPassword,
  ]
) {
  return engine(req, db, validator, ValidationError, dbQueryParams, hashPassword)
    .then((result) => successResponse(res, 201, result))
    .catch((err) => generateErrResponses(res, err, errResponse, ValidationError));
}

export default createUser;
