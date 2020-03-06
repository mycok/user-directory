import db from '../../database/elasticsearch-setup';

export default function (req, res, next) {
  const { body: { email } } = req;
  if (typeof email === 'undefined') return res.status(400).json({ message: "The '.email' field is missing" });
  if (typeof email !== 'string') return res.status(400).json({ message: "The '.email' field must be of type string" });

  return db.search({
    index: process.env.ELASTICSEARCH_INDEX,
    type: 'user',
    body: {
      query: {
        match: {
          searchTerm: email.replace(/[^\w-]/gi, '').trim(),
        },
      },
    },
    _source_includes: ['email'],
  })
    .then(({ hits }) => {
      if (hits.total.value > 0) {
        res.status(400).set('Content-Type', 'application/json').json({ message: `${email} already exists` });
      } else {
        next();
      }
    })
    .catch((err) => res.status(err.statusCode).set('Content-Type', 'application/json').json({ message: err.message }));
}
