function del(req, db, dbQueryParams) {
  const { params: { userId } } = req;

  return db.delete({
    ...dbQueryParams,
    id: userId,
    refresh: true,
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
