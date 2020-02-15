function retrieveUser(
  req, res, db,
  ...[engine, errResponse, successResponse, dbQueryParams, generateErrResponses]
) {
  return engine(req, db, dbQueryParams)
    .then((result) => successResponse(res, 200, result))
    .catch((err) => generateErrResponses(res, err, errResponse));
}

export default retrieveUser;
