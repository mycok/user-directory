import db from '../../database/elasticsearch-setup';

export default function (req, res, next, id) {
  db.get({
    index: process.env.ELASTICSEARCH_INDEX,
    type: 'user',
    id,
    _source_excludes: ['digest', 'password'],
  })
    .then(({ _id, _source }) => {
      req.user = { _id, _source };
      next();
    })
    .catch(() => res.status(404).set('Content-Type', 'application/json').json({ message: 'Not Found' }));
}
