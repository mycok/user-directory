function createUser(req, res, db, engine, validator, ValidationError) {
  return engine(req, db, validator, ValidationError)
    .then((result) => {
      res.status(201);
      res.set('Content-Type', 'text/plain');
      res.send(result._id);
      return result._id;
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(400);
        res.set('Content-Type', 'application/json');
        res.json({ message: err.message });
        return err;
      }
      res.status(500);
      res.set('Content-Type', 'application/json');
      res.json({ message: 'Internal server error' });
      return err;
    });
}

export default createUser;
