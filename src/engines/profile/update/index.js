function update(req, db, validator, ...[ValidationError, dbQueryParams]) {
  const { user: { _id }, body } = req;

  const validationResults = validator(body);
  if (validationResults instanceof ValidationError) {
    return Promise.reject(validationResults);
  }

  return db.update({
    ...dbQueryParams,
    id: _id,
    body: {
      doc: {
        profile: body,
      },
    },
  })
    .then(({ result }) => result)
    .catch(() => Promise.reject(new Error('Internal server error')));
}

export default update;
