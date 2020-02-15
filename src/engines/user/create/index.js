function create(req, db, validator, ...[ValidationError, dbQueryParams]) {
  const { body } = req;
  const validationResults = validator(body);

  if (validationResults instanceof ValidationError) {
    return Promise.reject(validationResults);
  }

  return db.index({
    ...dbQueryParams,
    body,
  })
    .then((({ _id, result }) => ({ _id, result })))
    .catch((() => Promise.reject(new Error('Internal server error'))));
}

export default create;
