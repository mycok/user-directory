function checkIfContentTypeIsJson(req, res, next) {
  if (!req.headers['content-type'].includes('application/json')) {
    return res
      .status(415)
      .set('Content-Type', 'application/json')
      .json({ message: 'The "Content-Type" header property must always be "application/json"' });
  }
  return next();
}

export default checkIfContentTypeIsJson;
