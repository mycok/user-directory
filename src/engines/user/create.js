function create(req, db) {
  const { body } = req;

  return db.index({
    index: process.env.ELASTICSEARCH_INDEX,
    type: 'user',
    body,
  });
}

export default create;
