function retrieve(req, db) {
  const { params: { userId } } = req;
  return db.get({
    index: process.env.ELASTICSEARCH_INDEX,
    type: 'user',
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
