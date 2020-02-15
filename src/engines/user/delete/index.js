function del(req, db, dbQueryParams) {
  const { user: { _id } } = req;

  return db.delete({
    ...dbQueryParams,
    id: _id,
    refresh: true,
  })
    .then(({ result }) => result)
    .catch(() => Promise.reject(new Error('Internal server error')));
}

export default del;
