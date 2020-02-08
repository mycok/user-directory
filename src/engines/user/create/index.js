function create(req, db, validator, ValidationError) {
  const { body } = req;
  const validationResults = validator(body);
  if (validationResults instanceof ValidationError) {
    return Promise.reject(validationResults);
  }
  return db.index({
    index: process.env.ELASTICSEARCH_INDEX,
    type: 'user',
    body,
  })
    .then(((result) => result))
    .catch(((err) => Promise.reject(new Error('Internal server error'))));
}

export default create;
