function checkForEmptyPayload(req, res, next) {
  if (
    ['POST', 'PUT', 'PATCH'].includes(req.method)
          && req.headers['content-length'] === '0'
  ) {
    return res
      .status(400)
      .set('Content-Type', 'application/json')
      .json({ message: 'Payload should not be empty' });
  }
  return next();
}

export default checkForEmptyPayload;
