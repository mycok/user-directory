function login(req, db, validator,
  ...[ValidationError, dbQueryParams, compareSync, sign]) {
  const { body } = req;
  const { email, password } = body;

  const validationResults = validator(body);

  if (validationResults instanceof ValidationError) {
    return Promise.reject(validationResults);
  }

  return db.search({
    ...dbQueryParams,
    body: {
      query: {
        match: {
          searchTerm: email.replace(/[^\w-]/gi, '').trim(),
        },
      },
    },
    _sourceIncludes: ['email', 'password'],
  })
    .then(({ hits }) => {
      if (hits.total.value > 0) {
        const isMatch = compareSync(password, hits.hits[0]._source.password);
        if (!isMatch) {
          return Promise.reject(new Error('Invalid password'));
        }
        // generate and return a token for the user
        return 'token';
      }
      return Promise.reject(new Error('Not Found'));
    }).catch((err) => Promise.reject(new Error(err.message)));
}

export default login;
