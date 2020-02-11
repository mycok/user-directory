function deleteUser(req, res, db, ...[engine, errResponse, successRespose, dbQueryParams]) {
  return engine(req, db, dbQueryParams)
    .then((resp) => successRespose(res, 200, resp.result, 'text/plain'))
    .catch((err) => {
      if (err.message === 'Not Found') {
        return errResponse(res, 404, err.message);
      }
      return errResponse(res, 500, err.message);
    });
}

export default deleteUser;
