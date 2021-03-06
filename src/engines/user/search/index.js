function search(req, db, validator, ...[ValidationError, dbQueryParams]) {
  const { query } = req;
  const validationResults = validator(query);

  if (validationResults instanceof ValidationError) {
    return Promise.reject(validationResults);
  }

  const dbQuery = {
    ...dbQueryParams,
    _source_excludes: ['password'],
  };

  if (query.query !== '') {
    dbQuery.q = query.query;
  }

  return db.search(dbQuery)
    .then(({ hits: { hits } }) => hits.map((hit) => hit._source))
    .catch(() => Promise.reject(new Error('Internal server error')));
}

export default search;
