function retrieve(req, db, dbQueryParams) {
  const { user: { _id } } = req;

  return db.get({
    ...dbQueryParams,
    id: _id,
    _source_excludes: ['digest', 'password'],
  })
    .then(({ _source }) => _source)
    .catch(() => Promise.reject(new Error('Internal server error')));
}

export default retrieve;
