function checkIfContentTypeIsJson(req, res, next) {
  const { method, headers } = req;

  if (['POST', 'PUT', 'PATCH'].includes(method)
  && !headers['content-type'].includes('application/json')) {
    res.status(415);
    res.set('Content-Type', 'application/json');
    return res.json({ message: 'The "Content-Type" header property must always be "application/json"' });
  }
  return next();
}

export default checkIfContentTypeIsJson;
