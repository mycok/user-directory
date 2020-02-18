function updateProfile(
  req, res, db,
  ...[
    engine, validator, ValidationError, errResponse,
    successResponse, dbQueryParams, generateErrResponses,
  ]
) {
  return engine(req, db, validator, ValidationError, dbQueryParams)
    .then((result) => successResponse(res, 200, result))
    .catch((err) => generateErrResponses(res, err, errResponse, ValidationError));
}

export default updateProfile;
