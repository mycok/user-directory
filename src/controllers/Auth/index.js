function userLogin(
  req, res, db,
  ...[
    engine, validator, ValidationError, errResponse,
    successResponse, dbQueryParams, generateErrResponses,
    compareSync, sign,
  ]
) {
  return engine(req, db, validator, ValidationError, dbQueryParams, compareSync, sign)
    .then((token) => successResponse(res, 200, token, 'text/plain', false))
    .catch((err) => generateErrResponses(res, err, errResponse, ValidationError));
}

export default userLogin;
