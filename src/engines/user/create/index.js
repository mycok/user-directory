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
    .then(((result) => result))
    .catch(((err) => Promise.reject(new Error('Internal server error'))));
}

export default create;
