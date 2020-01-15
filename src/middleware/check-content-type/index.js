function checkIfContentTypeIsSet(req, res, next) {
  const { method, headers } = req;

  if (['POST', 'PUT', 'PATCH'].includes(method)
    && headers['content-length']
            && headers['content-length'] !== '0'
            && !headers['content-type']
  ) {
    res.status(400);
    res.set('Content-Type', 'application/json');
    return res.json({ message: 'The "Content-Type" header property must be set for requests with a non empty payload' });
  }
  return next();
}

export default checkIfContentTypeIsSet;
