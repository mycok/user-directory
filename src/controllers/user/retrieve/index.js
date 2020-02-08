function retrieveUser(req, res, db, engine) {
  return engine(req, db)
    .then((result) => {
      res.status(200);
      res.set('Content-Type', 'application/json');
      res.send(result);
      return result;
    })
    .catch((err) => {
      if (err.message === 'Not Found') {
        res.status(404);
        res.set('Content-Type', 'application/json');
        res.json({ message: err.message });
        return err;
      }
      res.status(500);
      res.set('Content-Type', 'application/json');
      res.json({ message: err.message });
      return err;
    });
}

export default retrieveUser;
