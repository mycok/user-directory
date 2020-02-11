function retrieve(req, db, dbQueryParams) {
  const { params: { userId } } = req;

  return db.get({
    ...dbQueryParams,
    id: userId,
    _source_excludes: 'digest',
  })
    .then((res) => res._source)
    .catch((err) => {
      if (err.statusCode === 404) {
        return Promise.reject(new Error(err.message));
      }
      return Promise.reject(new Error('Internal server error'));
    });
}

export default retrieve;
