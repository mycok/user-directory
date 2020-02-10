function del(req, db) {
  const { params: { userId } } = req;
  return db.delete({
    index: process.env.ELASTICSEARCH_INDEX,
    type: 'user',
    id: userId,
  })
    .then((resp) => resp)
    .catch((err) => {
      if (err.statusCode === 404) {
        return Promise.reject(new Error('Not Found'));
      }
      return Promise.reject(new Error('Internal server error'));
    });
}

export default del;
