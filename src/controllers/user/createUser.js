import create from '../../engines/user/create';

function createUser(req, res, db) {
  create(req, db).then((result) => res
    .status(201)
    .set('Content-Type', 'text/plain')
    .send(result._id), (err) => {
    res
      .status(500)
      .json({ message: 'Iternal Server Error!' });
  });
}

export default createUser;
