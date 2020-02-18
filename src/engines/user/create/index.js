function create(req, db, validator, ...[ValidationError, dbQueryParams, hashPassword]) {
  const { body } = req;
  const validationResults = validator(body);

  if (validationResults instanceof ValidationError) {
    return Promise.reject(validationResults);
  }

  const password = hashPassword(body.password);

  return db.index({
    ...dbQueryParams,
    body: { ...body, password },
  })
    .then((({ _id, result }) => ({ _id, result })))
    .catch((() => Promise.reject(new Error('Internal server error'))));
}

export default create;
