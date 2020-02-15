function deleteUser(req, res, db,
  ...[engine, errResponse, successRespose, dbQueryParams, generateErrResponses]) {
  return engine(req, db, dbQueryParams)
    .then((result) => successRespose(res, 200, result, 'text/plain', false))
    .catch((err) => generateErrResponses(res, err, errResponse));
}

export default deleteUser;
