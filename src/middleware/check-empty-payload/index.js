function checkForEmptyPayload(req, res, next) {
  if (
    ['POST', 'PUT', 'PATCH'].includes(req.method)
            && req.headers['content-length'] === '0'
  ) {
    res.status(400);
    res.set('Content-Type', 'application/json');
    return res.json({ message: 'Payload should not be empty' });
  }
  return next();
}

export default checkForEmptyPayload;
