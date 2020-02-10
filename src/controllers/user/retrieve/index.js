function retrieveUser(req, res, db, ...[engine, errResponse, successResponse]) {
  return engine(req, db)
    .then((result) => successResponse(res, 200, result))
    .catch((err) => {
      if (err.message === 'Not Found') {
        return errResponse(res, 404, err.message);
      }
      return errResponse(res, 500, err.message);
    });
}

export default retrieveUser;
